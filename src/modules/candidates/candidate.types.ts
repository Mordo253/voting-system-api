import { Candidate } from '@prisma/client';

/**
 * Tipos para el módulo de candidatos
 */

// Tipo base del candidato (del modelo Prisma)
export type CandidateEntity = Candidate;

// Candidato con información de votos recibidos
export interface CandidateWithVotes extends Candidate {
  votes_received: {
    id: string;
    voter_id: string;
    voted_at: Date;
  }[];
}

// Input para crear candidato
export interface CreateCandidateInput {
  name: string;
  party?: string;
}

// Input para actualizar candidato
export interface UpdateCandidateInput {
  name?: string;
  party?: string;
}

// Filtros de búsqueda
export interface CandidateFilters {
  party?: string;
  name?: string;
  minVotes?: number;
}