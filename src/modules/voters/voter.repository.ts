import prisma from '../../config/database';
import { CreateVoterInput, UpdateVoterInput, VoterFilters } from './voter.types';
import { Voter } from '@prisma/client';

/**
 * Repository Pattern: Abstrae el acceso a datos
 * Todas las operaciones de base de datos relacionadas con Voters
 */

export class VoterRepository {
  /**
   * Crear un nuevo votante
   */
  async create(data: CreateVoterInput): Promise<Voter> {
    return await prisma.voter.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(), // Normalizar email
      },
    });
  }

  /**
   * Buscar votante por ID
   */
  async findById(id: string): Promise<Voter | null> {
    return await prisma.voter.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar votante por email
   */
  async findByEmail(email: string): Promise<Voter | null> {
    return await prisma.voter.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Listar votantes con paginación y filtros
   */
  async findAll(params: {
    cursor?: string;
    limit: number;
    filters?: VoterFilters;
  }): Promise<Voter[]> {
    const { cursor, limit, filters } = params;

    // Construir objeto where dinámicamente
    const where: any = {};

    if (filters?.has_voted !== undefined) {
      where.has_voted = filters.has_voted;
    }

    if (filters?.email) {
      where.email = {
        contains: filters.email.toLowerCase(),
        mode: 'insensitive',
      };
    }

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    return await prisma.voter.findMany({
      take: limit + 1, // +1 para saber si hay más páginas
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Saltar el cursor mismo
      }),
      where,
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Contar votantes con filtros
   */
  async count(filters?: VoterFilters): Promise<number> {
    const where: any = {};

    if (filters?.has_voted !== undefined) {
      where.has_voted = filters.has_voted;
    }

    return await prisma.voter.count({ where });
  }

  /**
   * Actualizar votante
   */
  async update(id: string, data: UpdateVoterInput): Promise<Voter> {
    return await prisma.voter.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email.toLowerCase() }),
        updated_at: new Date(),
      },
    });
  }

  /**
   * Eliminar votante
   */
  async delete(id: string): Promise<Voter> {
    return await prisma.voter.delete({
      where: { id },
    });
  }

  /**
   * Verificar si existe un votante con un email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.voter.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  /**
   * Marcar votante como que ya votó
   */
  async markAsVoted(id: string): Promise<Voter> {
    return await prisma.voter.update({
      where: { id },
      data: { has_voted: true },
    });
  }
}