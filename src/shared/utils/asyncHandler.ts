import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper para funciones async en Express
 * Captura automáticamente errores y los pasa al middleware de error
 * 
 * Evita tener que escribir try-catch en cada controlador
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};