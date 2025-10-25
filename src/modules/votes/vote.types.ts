import { Vote } from '@prisma/client';

/**
 * Tipos para el módulo de votos
 */

// Tipo base del voto (del modelo Prisma)
export type VoteEntity = Vote;

// Voto con información completa (votante + candidato)
export interface VoteWithDetails extends Vote {
  voter: {
    id: string;
    name: string;
    email: string;
  };
  candidate: {
    id: string;
    name: string;
    party: string | null;
  };
}

// Input para emitir voto
export interface CastVoteInput {
  voter_id: string;
  candidate_id: string;
}

// Estadísticas de votación
export interface VotingStatistics {
  total_votes: number;
  total_voters: number;
  voters_who_voted: number;
  participation_rate: string;
  candidates_statistics: CandidateStatistic[];
}

// Estadística por candidato
export interface CandidateStatistic {
  candidate_id: string;
  candidate_name: string;
  party: string | null;
  total_votes: number;
  percentage: string;
}