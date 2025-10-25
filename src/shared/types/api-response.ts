/**
 * Tipos para respuestas estandarizadas de la API
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  stack?: string; // Solo en desarrollo
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;