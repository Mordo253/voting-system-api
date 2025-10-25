import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { ApiError } from '../shared/utils/ApiError';
import { asyncHandler } from '../shared/utils/asyncHandler';

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization
 */

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const authService = new AuthService();
    const payload = authService.verifyToken(token);

    // Agregar user al request
    (req as any).user = payload;

    next();
  }
);

/**
 * Verificar rol de admin
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    throw ApiError.forbidden('Acceso denegado: se requiere rol de administrador');
  }

  next();
};