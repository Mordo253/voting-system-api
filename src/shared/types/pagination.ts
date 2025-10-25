/**
 * Tipos para paginación cursor-based
 */

export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}