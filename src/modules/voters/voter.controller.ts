import { Request, Response } from 'express';
import { VoterService } from './voter.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { CreateVoterDto, UpdateVoterDto, ListVotersQueryDto } from './voter.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Controller: Maneja requests HTTP y devuelve responses
    * Valida inputs usando DTOs y delega lógica al Service Layer
 */

export class VoterController {
  private voterService: VoterService;

  constructor() {
    this.voterService = new VoterService();
  }

  /**
   * POST /voters
   * Crear nuevo votante
   */
  createVoter = asyncHandler(async (req: Request, res: Response) => {
    // Validar DTO
    const dto = plainToClass(CreateVoterDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    // Crear votante
    const voter = await this.voterService.createVoter({
      name: dto.name,
      email: dto.email,
    });

    res.status(201).json({
      success: true,
      data: voter,
      message: 'Votante creado exitosamente',
    });
  });

  /**
   * GET /voters
   * Listar votantes con paginación
   */
  getVoters = asyncHandler(async (req: Request, res: Response) => {
    // Parsear query params
    const queryDto = plainToClass(ListVotersQueryDto, req.query);
    const errors = await validate(queryDto);

    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    const result = await this.voterService.getVoters({
      cursor: queryDto.cursor,
      limit: queryDto.limit,
      filters: {
        has_voted: queryDto.has_voted,
      },
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * GET /voters/:id
   * Obtener votante por ID
   */
  getVoterById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const voter = await this.voterService.getVoterById(id);

    res.status(200).json({
      success: true,
      data: voter,
    });
  });

  /**
   * PATCH /voters/:id
   * Actualizar votante
   */
  updateVoter = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validar DTO
    const dto = plainToClass(UpdateVoterDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    const voter = await this.voterService.updateVoter(id, {
      name: dto.name,
      email: dto.email,
    });

    res.status(200).json({
      success: true,
      data: voter,
      message: 'Votante actualizado exitosamente',
    });
  });

  /**
   * DELETE /voters/:id
   * Eliminar votante
   */
  deleteVoter = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.voterService.deleteVoter(id);

    res.status(200).json({
      success: true,
      message: 'Votante eliminado exitosamente',
    });
  });

  /**
   * GET /voters/stats
   * Obtener estadísticas de votantes
   */
  getVoterStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.voterService.getVoterStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}