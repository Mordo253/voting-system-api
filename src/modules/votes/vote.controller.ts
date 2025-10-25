import { Request, Response } from 'express';
import { VoteService } from './vote.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { CastVoteDto } from './vote.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiError } from '../../shared/utils/ApiError';

/**
 * Controller de Votos
 */

export class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  /**
   * POST /votes
   * Emitir un voto
   */
  castVote = asyncHandler(async (req: Request, res: Response) => {
    // Validar DTO
    const dto = plainToClass(CastVoteDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw ApiError.badRequest(messages.join(', '));
    }

    // Emitir voto (transacción)
    const vote = await this.voteService.castVote({
      voter_id: dto.voter_id,
      candidate_id: dto.candidate_id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: vote.id,
        voter_id: vote.voter_id,
        candidate_id: vote.candidate_id,
        voted_at: vote.voted_at,
      },
      message: 'Voto emitido exitosamente',
    });
  });

  /**
   * GET /votes
   * Obtener todos los votos con detalles
   */
  getAllVotes = asyncHandler(async (req: Request, res: Response) => {
    const votes = await this.voteService.getAllVotes();

    res.status(200).json({
      success: true,
      data: votes,
      total: votes.length,
    });
  });

  /**
   * GET /votes/statistics
   * Obtener estadísticas completas de votación
   */
  getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const statistics = await this.voteService.getStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  });

  /**
   * GET /votes/:id
   * Obtener voto por ID
   */
  getVoteById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const vote = await this.voteService.getVoteById(id);

    res.status(200).json({
      success: true,
      data: vote,
    });
  });

  /**
   * GET /votes/voter/:voter_id
   * Verificar si un votante ha votado y obtener su voto
   */
  getVoteByVoterId = asyncHandler(async (req: Request, res: Response) => {
    const { voter_id } = req.params;

    const vote = await this.voteService.getVoteByVoterId(voter_id);

    if (!vote) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'El votante no ha emitido su voto',
      });
    }

    res.status(200).json({
      success: true,
      data: vote,
      message: 'El votante ya ha votado',
    });
  });
}