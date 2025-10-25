//Clase personalizada de error para la API
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Mantiene el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory metodos para errores comunes
   */
  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'No autorizado'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Acceso prohibido'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Recurso no encontrado'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static internal(message = 'Error interno del servidor'): ApiError {
    return new ApiError(500, message, false);
  }
}