import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/utils/ApiError';
import logger from '../shared/utils/logger';
import { env } from '../config/env';

/**
 * Middleware de manejo de errores centralizado
 * Captura todos los errores y devuelve respuestas consistentes
 */

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log del error
  logger.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Si es un ApiError (error operacional esperado)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Error de Prisma (base de datos)
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      error: 'Error en la operación de base de datos',
      statusCode: 400,
      ...(env.NODE_ENV === 'development' && { details: err.message }),
    });
  }

  // Error de validación de Prisma
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos',
      statusCode: 400,
      ...(env.NODE_ENV === 'development' && { details: err.message }),
    });
  }

  // Error genérico no manejado (bug del código)
  return res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    statusCode: 500,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.path}`,
    statusCode: 404,
  });
};