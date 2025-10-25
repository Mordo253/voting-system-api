import prisma from '../../config/database';
import {
  CreateCandidateInput,
  UpdateCandidateInput,
  CandidateFilters,
} from './candidate.types';
import { Candidate } from '@prisma/client';

/**
 * Repository para operaciones de base de datos de Candidatos
 */

export class CandidateRepository {
  /**
   * Crear un nuevo candidato
   */
  async create(data: CreateCandidateInput): Promise<Candidate> {
    return await prisma.candidate.create({
      data: {
        name: data.name,
        party: data.party || null,
      },
    });
  }

  /**
   * Buscar candidato por ID
   */
  async findById(id: string): Promise<Candidate | null> {
    return await prisma.candidate.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar candidato por nombre
   */
  async findByName(name: string): Promise<Candidate | null> {
    return await prisma.candidate.findUnique({
      where: { name },
    });
  }

  /**
   * Listar candidatos con paginación y filtros
   */
  async findAll(params: {
    cursor?: string;
    limit: number;
    filters?: CandidateFilters;
  }): Promise<Candidate[]> {
    const { cursor, limit, filters } = params;

    // Construir objeto where dinámicamente
    const where: any = {};

    if (filters?.party) {
      where.party = {
        contains: filters.party,
        mode: 'insensitive',
      };
    }

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters?.minVotes !== undefined) {
      where.votes = {
        gte: filters.minVotes,
      };
    }

    return await prisma.candidate.findMany({
      take: limit + 1, // +1 para saber si hay más páginas
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      where,
      orderBy: { votes: 'desc' }, // Ordenar por votos (descendente)
    });
  }

  /**
   * Contar candidatos con filtros
   */
  async count(filters?: CandidateFilters): Promise<number> {
    const where: any = {};

    if (filters?.party) {
      where.party = {
        contains: filters.party,
        mode: 'insensitive',
      };
    }

    if (filters?.minVotes !== undefined) {
      where.votes = {
        gte: filters.minVotes,
      };
    }

    return await prisma.candidate.count({ where });
  }

  /**
   * Actualizar candidato
   */
  async update(id: string, data: UpdateCandidateInput): Promise<Candidate> {
    return await prisma.candidate.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.party !== undefined && { party: data.party || null }),
        updated_at: new Date(),
      },
    });
  }

  /**
   * Eliminar candidato
   */
  async delete(id: string): Promise<Candidate> {
    return await prisma.candidate.delete({
      where: { id },
    });
  }

  /**
   * Verificar si existe un candidato con un nombre
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await prisma.candidate.count({
      where: { name },
    });
    return count > 0;
  }

  /**
   * Incrementar votos del candidato (uso interno desde módulo votes)
   */
  async incrementVotes(id: string): Promise<Candidate> {
    return await prisma.candidate.update({
      where: { id },
      data: {
        votes: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Obtener candidatos ordenados por votos (ranking)
   */
  async getRanking(limit: number = 10): Promise<Candidate[]> {
    return await prisma.candidate.findMany({
      take: limit,
      orderBy: { votes: 'desc' },
    });
  }
}