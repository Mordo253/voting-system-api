import { VoterRepository } from './voter.repository';
import { CreateVoterInput, UpdateVoterInput, VoterFilters } from './voter.types';
import { ApiError } from '../../shared/utils/ApiError';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';
import { PaginatedResponse } from '../../shared/types/pagination';
import { Voter } from '@prisma/client';
import prisma from '../../config/database';

/**
 * Service Layer: Contiene toda la lógica de negocio
 * Orquesta repositorios y aplica reglas de negocio
 */

export class VoterService {
  private voterRepository: VoterRepository;

  constructor() {
    this.voterRepository = new VoterRepository();
  }

  /**
   * Crear un nuevo votante
   * Reglas:
   * - Email debe ser único
   * - Email no debe estar registrado como candidato
   */
  async createVoter(data: CreateVoterInput): Promise<Voter> {
    // RN-V1: Verificar que el email no exista
    const existingVoter = await this.voterRepository.findByEmail(data.email);
    if (existingVoter) {
      throw ApiError.conflict(ERROR_MESSAGES.VOTER_EMAIL_EXISTS);
    }

    // RN-V2: Verificar que el email no esté registrado como candidato
    const candidateWithEmail = await prisma.candidate.findFirst({
      where: {
        name: {
          equals: data.email,
          mode: 'insensitive',
        },
      },
    });

    if (candidateWithEmail) {
      throw ApiError.conflict(ERROR_MESSAGES.VOTER_IS_CANDIDATE);
    }

    // Crear votante
    return await this.voterRepository.create(data);
  }

  /**
   * Obtener votante por ID
   */
  async getVoterById(id: string): Promise<Voter> {
    const voter = await this.voterRepository.findById(id);

    if (!voter) {
      throw ApiError.notFound(ERROR_MESSAGES.VOTER_NOT_FOUND);
    }

    return voter;
  }

  /**
   * Listar votantes con paginación cursor-based
   */
  async getVoters(params: {
    cursor?: string;
    limit?: number;
    filters?: VoterFilters;
  }): Promise<PaginatedResponse<Voter>> {
    const limit = params.limit || 10;

    const voters = await this.voterRepository.findAll({
      cursor: params.cursor,
      limit,
      filters: params.filters,
    });

    // Verificar si hay más páginas
    const hasMore = voters.length > limit;
    const data = hasMore ? voters.slice(0, -1) : voters;

    // Obtener total count
    const totalCount = await this.voterRepository.count(params.filters);

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
   * Actualizar votante
   * Reglas:
   * - Si cambia email, debe ser único
   */
  async updateVoter(id: string, data: UpdateVoterInput): Promise<Voter> {
    // Verificar que el votante existe
    const voter = await this.voterRepository.findById(id);
    if (!voter) {
      throw ApiError.notFound(ERROR_MESSAGES.VOTER_NOT_FOUND);
    }

    // Si se actualiza el email, verificar que no exista
    if (data.email && data.email.toLowerCase() !== voter.email) {
      const existingVoter = await this.voterRepository.findByEmail(data.email);
      if (existingVoter) {
        throw ApiError.conflict(ERROR_MESSAGES.VOTER_EMAIL_EXISTS);
      }
    }

    return await this.voterRepository.update(id, data);
  }

  /**
   * Eliminar votante
   * Reglas:
   * - Solo se puede eliminar si NO ha votado
   */
  async deleteVoter(id: string): Promise<void> {
    // Verificar que el votante existe
    const voter = await this.voterRepository.findById(id);
    if (!voter) {
      throw ApiError.notFound(ERROR_MESSAGES.VOTER_NOT_FOUND);
    }

    // RN-V3: Verificar que no ha votado
    if (voter.has_voted) {
      throw ApiError.badRequest(ERROR_MESSAGES.VOTER_HAS_VOTED_CANNOT_DELETE);
    }

    await this.voterRepository.delete(id);
  }

  /**
   * Obtener estadísticas de votantes
   */
  async getVoterStats(): Promise<{
    total: number;
    voted: number;
    pending: number;
    participationRate: string;
  }> {
    const total = await this.voterRepository.count();
    const voted = await this.voterRepository.count({ has_voted: true });
    const pending = total - voted;
    const participationRate =
      total > 0 ? ((voted / total) * 100).toFixed(2) : '0.00';

    return {
      total,
      voted,
      pending,
      participationRate,
    };
  }
}