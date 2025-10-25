import { Request, Response } from 'express';
import { CandidateService } from './candidate.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import {
  CreateCandidateDto,
  UpdateCandidateDto,
  ListCandidatesQueryDto,
} from './candidate.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Controller de Candidatos
 */

export class CandidateController {
  private candidateService: CandidateService;

  constructor() {
    this.candidateService = new CandidateService();
  }

  /**
   * POST /candidates
   * Crear nuevo candidato
   */
  createCandidate = asyncHandler(async (req: Request, res: Response) => {
    // Validar DTO
    const dto = plainToClass(CreateCandidateDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    // Crear candidato
    const candidate = await this.candidateService.createCandidate({
      name: dto.name,
      party: dto.party,
    });

    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Candidato creado exitosamente',
    });
  });

  /**
   * GET /candidates
   * Listar candidatos con paginación
   */
  getCandidates = asyncHandler(async (req: Request, res: Response) => {
    // Parsear query params
    const queryDto = plainToClass(ListCandidatesQueryDto, req.query);
    const errors = await validate(queryDto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    const result = await this.candidateService.getCandidates({
      cursor: queryDto.cursor,
      limit: queryDto.limit,
      filters: {
        party: queryDto.party,
        name: queryDto.search,
        minVotes: queryDto.minVotes,
      },
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * GET /candidates/ranking
   * Obtener ranking de candidatos
   */
  getRanking = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const ranking = await this.candidateService.getRanking(limit);

    res.status(200).json({
      success: true,
      data: ranking,
    });
  });

  /**
   * GET /candidates/stats
   * Obtener estadísticas de candidatos
   */
  getCandidateStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.candidateService.getCandidateStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  /**
   * GET /candidates/:id
   * Obtener candidato por ID
   */
  getCandidateById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const candidate = await this.candidateService.getCandidateById(id);

    res.status(200).json({
      success: true,
      data: candidate,
    });
  });

  /**
   * PATCH /candidates/:id
   * Actualizar candidato
   */
  updateCandidate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validar DTO
    const dto = plainToClass(UpdateCandidateDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    const candidate = await this.candidateService.updateCandidate(id, {
      name: dto.name,
      party: dto.party,
    });

    res.status(200).json({
      success: true,
      data: candidate,
      message: 'Candidato actualizado exitosamente',
    });
  });

  /**
   * DELETE /candidates/:id
   * Eliminar candidato
   */
  deleteCandidate = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.candidateService.deleteCandidate(id);

    res.status(200).json({
      success: true,
      message: 'Candidato eliminado exitosamente',
    });
  });
}