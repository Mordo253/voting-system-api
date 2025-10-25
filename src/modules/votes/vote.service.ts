import { VoteRepository } from './vote.repository';
import { CastVoteInput, VotingStatistics, VoteWithDetails } from './vote.types';
import { ApiError } from '../../shared/utils/ApiError';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { Vote } from '@prisma/client';
import prisma from '../../config/database';
import logger from '../../shared/utils/logger';

/**
 * Service con lógica de negocio de Votos
 */

export class VoteService {
  private voteRepository: VoteRepository;

  constructor() {
    this.voteRepository = new VoteRepository();
  }

  /**
   * Emitir un voto (TRANSACCIONAL)
   * 
   * Reglas:
   * - Votante debe existir
   * - Votante NO debe haber votado
   * - Candidato debe existir
   * - Se actualiza has_voted del votante
   * - Se incrementa votes del candidato
   * - TODO es atómico
   */
  async castVote(data: CastVoteInput): Promise<Vote> {
    const { voter_id, candidate_id } = data;

    logger.info('Iniciando emisión de voto', { voter_id, candidate_id });

    // Ejecutar todo en una transacción
    return await prisma.$transaction(async (tx) => {
      // 1. Verificar que el votante existe
      const voter = await tx.voter.findUnique({
        where: { id: voter_id },
      });

      if (!voter) {
        logger.warn('Intento de voto con votante inexistente', { voter_id });
        throw ApiError.notFound(ERROR_MESSAGES.VOTER_NOT_FOUND);
      }

      // 2. Verificar que el votante NO ha votado
      if (voter.has_voted) {
        logger.warn('Intento de voto duplicado', {
          voter_id,
          voter_email: voter.email,
        });
        throw ApiError.badRequest(ERROR_MESSAGES.VOTER_ALREADY_VOTED);
      }

      // 3. Verificar que el candidato existe
      const candidate = await tx.candidate.findUnique({
        where: { id: candidate_id },
      });

      if (!candidate) {
        logger.warn('Intento de voto con candidato inexistente', {
          candidate_id,
        });
        throw ApiError.notFound(ERROR_MESSAGES.CANDIDATE_NOT_FOUND);
      }

      // 4. Crear el voto
      const vote = await tx.vote.create({
        data: {
          voter_id,
          candidate_id,
        },
      });

      // 5. Actualizar votante (marcar como votado)
      await tx.voter.update({
        where: { id: voter_id },
        data: { has_voted: true },
      });

      // 6. Incrementar contador de votos del candidato
      await tx.candidate.update({
        where: { id: candidate_id },
        data: {
          votes: {
            increment: 1,
          },
        },
      });

      logger.info('Voto emitido exitosamente', {
        vote_id: vote.id,
        voter_id,
        candidate_id,
        candidate_name: candidate.name,
      });

      return vote;
    });
  }

  /**
   * Obtener todos los votos con detalles
   */
  async getAllVotes(): Promise<VoteWithDetails[]> {
    return await this.voteRepository.findAllWithDetails();
  }

  /**
   * Obtener voto por ID
   */
  async getVoteById(id: string): Promise<Vote> {
    const vote = await this.voteRepository.findById(id);

    if (!vote) {
      throw ApiError.notFound(ERROR_MESSAGES.VOTE_NOT_FOUND);
    }

    return vote;
  }

  /**
   * Obtener estadísticas completas de votación
   * 
   * Calcula:
   * - Total de votos emitidos
   * - Total de votantes registrados
   * - Votantes que han votado
   * - Tasa de participación
   * - Estadísticas por candidato (votos y porcentajes)
   */
  async getStatistics(): Promise<VotingStatistics> {
    logger.info('Calculando estadísticas de votación');

    // 1. Obtener todos los candidatos con sus votos actuales
    const candidates = await prisma.candidate.findMany({
      select: {
        id: true,
        name: true,
        party: true,
        votes: true,
      },
      orderBy: {
        votes: 'desc', // Ordenar por votos descendente
      },
    });

    // 2. Total de votos emitidos
    const totalVotes = await this.voteRepository.count();

    // 3. Total de votantes registrados
    const totalVoters = await prisma.voter.count();

    // 4. Votantes que han votado
    const votersWhoVoted = await prisma.voter.count({
      where: { has_voted: true },
    });

    // 5. Calcular tasa de participación
    const participationRate =
      totalVoters > 0
        ? ((votersWhoVoted / totalVoters) * 100).toFixed(2)
        : '0.00';

    // 6. Calcular estadísticas por candidato
    const candidatesStatistics = candidates.map((candidate) => ({
      candidate_id: candidate.id,
      candidate_name: candidate.name,
      party: candidate.party,
      total_votes: candidate.votes,
      percentage:
        totalVotes > 0
          ? ((candidate.votes / totalVotes) * 100).toFixed(2)
          : '0.00',
    }));

    const statistics: VotingStatistics = {
      total_votes: totalVotes,
      total_voters: totalVoters,
      voters_who_voted: votersWhoVoted,
      participation_rate: participationRate,
      candidates_statistics: candidatesStatistics,
    };

    logger.info('Estadísticas calculadas', {
      total_votes: totalVotes,
      participation_rate: participationRate,
    });

    return statistics;
  }

  /**
   * Verificar si un votante ya votó
   */
  async hasVoterVoted(voter_id: string): Promise<boolean> {
    const vote = await this.voteRepository.findByVoterId(voter_id);
    return vote !== null;
  }

  /**
   * Obtener el voto de un votante específico
   */
  async getVoteByVoterId(voter_id: string): Promise<Vote | null> {
    return await this.voteRepository.findByVoterId(voter_id);
  }
}