/**
 * Tipos para autenticación
 */

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: 'admin' | 'voter';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}