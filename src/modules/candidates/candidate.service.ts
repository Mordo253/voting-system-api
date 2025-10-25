import { CandidateRepository } from './candidate.repository';
import {
  CreateCandidateInput,
  UpdateCandidateInput,
  CandidateFilters,
} from './candidate.types';
import { ApiError } from '../../shared/utils/ApiError';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { PaginatedResponse } from '../../shared/types/pagination';
import { Candidate } from '@prisma/client';
import prisma from '../../config/database';

/**
 * Service con lógica de negocio de Candidatos
 */

export class CandidateService {
  private candidateRepository: CandidateRepository;

  constructor() {
    this.candidateRepository = new CandidateRepository();
  }

  /**
   * Crear un nuevo candidato
   * Reglas:
   * - Nombre debe ser único
   * - Nombre no debe estar registrado como votante
   */
  async createCandidate(data: CreateCandidateInput): Promise<Candidate> {
    // RN-C1: Verificar que el nombre no exista
    const existingCandidate = await this.candidateRepository.findByName(
      data.name
    );
    if (existingCandidate) {
      throw ApiError.conflict(ERROR_MESSAGES.CANDIDATE_NAME_EXISTS);
    }

    // RN-C2: Verificar que el nombre no esté registrado como votante
    const voterWithName = await prisma.voter.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (voterWithName) {
      throw ApiError.conflict(ERROR_MESSAGES.CANDIDATE_IS_VOTER);
    }

    // Crear candidato
    return await this.candidateRepository.create(data);
  }

  /**
   * Obtener candidato por ID
   */
  async getCandidateById(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findById(id);

    if (!candidate) {
      throw ApiError.notFound(ERROR_MESSAGES.CANDIDATE_NOT_FOUND);
    }

    return candidate;
  }

  /**
   * Listar candidatos con paginación
   */
  async getCandidates(params: {
    cursor?: string;
    limit?: number;
    filters?: CandidateFilters;
  }): Promise<PaginatedResponse<Candidate>> {
    const limit = params.limit || 10;

    const candidates = await this.candidateRepository.findAll({
      cursor: params.cursor,
      limit,
      filters: params.filters,
    });

    // Verificar si hay más páginas
    const hasMore = candidates.length > limit;
    const data = hasMore ? candidates.slice(0, -1) : candidates;

    // Obtener total count
    const totalCount = await this.candidateRepository.count(params.filters);

    return {
      data,
      pagination: {
        nextCursor: hasMore ? data[data.length - 1].id : null,
        hasMore,
        totalCount,
      },
    };
  }

  /**
   * Actualizar candidato
   * Reglas:
   * - Si cambia nombre, debe ser único
   */
  async updateCandidate(
    id: string,
    data: UpdateCandidateInput
  ): Promise<Candidate> {
    // Verificar que el candidato existe
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw ApiError.notFound(ERROR_MESSAGES.CANDIDATE_NOT_FOUND);
    }

    // Si se actualiza el nombre, verificar que no exista
    if (data.name && data.name !== candidate.name) {
      const existingCandidate = await this.candidateRepository.findByName(
        data.name
      );
      if (existingCandidate) {
        throw ApiError.conflict(ERROR_MESSAGES.CANDIDATE_NAME_EXISTS);
      }
    }

    return await this.candidateRepository.update(id, data);
  }

  /**
   * Eliminar candidato
   * Reglas:
   * - Solo se puede eliminar si NO tiene votos
   */
  async deleteCandidate(id: string): Promise<void> {
    // Verificar que el candidato existe
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw ApiError.notFound(ERROR_MESSAGES.CANDIDATE_NOT_FOUND);
    }

    // RN-C3: Verificar que no tenga votos
    if (candidate.votes > 0) {
      throw ApiError.badRequest(
        ERROR_MESSAGES.CANDIDATE_HAS_VOTES_CANNOT_DELETE
      );
    }

    await this.candidateRepository.delete(id);
  }

  /**
   * Obtener ranking de candidatos (por votos)
   */
  async getRanking(limit: number = 10): Promise<Candidate[]> {
    return await this.candidateRepository.getRanking(limit);
  }

  /**
   * Obtener estadísticas de candidatos
   */
  async getCandidateStats(): Promise<{
    total: number;
    withVotes: number;
    withoutVotes: number;
    totalVotes: number;
    averageVotes: string;
  }> {
    const allCandidates = await prisma.candidate.findMany();
    
    const total = allCandidates.length;
    const withVotes = allCandidates.filter((c) => c.votes > 0).length;
    const withoutVotes = total - withVotes;
    const totalVotes = allCandidates.reduce((sum, c) => sum + c.votes, 0);
    const averageVotes = total > 0 ? (totalVotes / total).toFixed(2) : '0.00';

    return {
      total,
      withVotes,
      withoutVotes,
      totalVotes,
      averageVotes,
    };
  }
}