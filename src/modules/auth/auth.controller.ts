import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { LoginDto, RegisterDto } from './auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Controller de autenticación
 */

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /auth/register
   * Registrar nuevo usuario
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // Validar DTO
    const dto = plainToClass(RegisterDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    const result = await this.authService.register({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Usuario registrado exitosamente',
    });
  });

  /**
   * POST /auth/login
   * Iniciar sesión
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    // Validar DTO
    const dto = plainToClass(LoginDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    const result = await this.authService.login({
      email: dto.email,
      password: dto.password,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login exitoso',
    });
  });

  /**
   * GET /auth/me
   * Obtener usuario autenticado
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    // El middleware de auth agrega user a req
    const user = (req as any).user;

    res.status(200).json({
      success: true,
      data: user,
    });
  });
}