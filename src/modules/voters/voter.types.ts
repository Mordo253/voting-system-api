import { Voter } from '@prisma/client';

/**
 * Tipos para el módulo de votantes
 */

// Tipo base del votante (del modelo Prisma)
export type VoterEntity = Voter;

// Votante con información de su voto (para consultas admin)
export interface VoterWithVote extends Voter {
  vote: {
    id: string;
    candidate_id: string;
    voted_at: Date;
  } | null;
}

// Input para crear votante
export interface CreateVoterInput {
  name: string;
  email: string;
}

// Input para actualizar votante
export interface UpdateVoterInput {
  name?: string;
  email?: string;
}

// Filtros de búsqueda
export interface VoterFilters {
  has_voted?: boolean;
  email?: string;
  name?: string;
}