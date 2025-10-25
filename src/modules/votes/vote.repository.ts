import prisma from '../../config/database';
import { Vote } from '@prisma/client';
import { VoteWithDetails } from './vote.types';

/**
 * Repository para operaciones de base de datos de Votos
 */

export class VoteRepository {
  /**
   * Crear un voto (usado dentro de transacción)
   */
  async create(
    voter_id: string,
    candidate_id: string,
    tx?: any
  ): Promise<Vote> {
    const client = tx || prisma;

    return await client.vote.create({
      data: {
        voter_id,
        candidate_id,
      },
    });
  }

  /**
   * Buscar voto por ID
   */
  async findById(id: string): Promise<Vote | null> {
    return await prisma.vote.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar voto por voter_id
   */
  async findByVoterId(voter_id: string): Promise<Vote | null> {
    return await prisma.vote.findUnique({
      where: { voter_id },
    });
  }

  /**
   * Listar todos los votos con detalles
   */
  async findAllWithDetails(): Promise<VoteWithDetails[]> {
    return await prisma.vote.findMany({
      include: {
        voter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            party: true,
          },
        },
      },
      orderBy: {
        voted_at: 'desc',
      },
    });
  }

  /**
   * Contar total de votos
   */
  async count(): Promise<number> {
    return await prisma.vote.count();
  }

  /**
   * Contar votos por candidato
   */
  async countByCandidate(candidate_id: string): Promise<number> {
    return await prisma.vote.count({
      where: { candidate_id },
    });
  }

  /**
   * Obtener votos agrupados por candidato
   */
  async getVotesByCandidateGrouped(): Promise<Array<{ candidate_id: string; count: number }>> {
  const result = await prisma.vote.groupBy({
      by: ['candidate_id'],
      _count: {
      candidate_id: true,
      },
  });

  return result.map((r) => ({
      candidate_id: r.candidate_id,
      count: r._count.candidate_id,
  }));
  }
}