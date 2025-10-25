import { Router } from 'express';
import { VoteController } from './vote.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const voteController = new VoteController();

/**
 * @openapi
 * /api/votes:
 *   post:
 *     tags:
 *       - Votes
 *     summary: Emitir un voto
 *     description: Registra el voto de un votante por un candidato (transacción atómica)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CastVoteInput'
 *           example:
 *             voter_id: "550e8400-e29b-41d4-a716-446655440000"
 *             candidate_id: "660e9511-f30c-52e5-b827-557766551111"
 *     responses:
 *       201:
 *         description: Voto emitido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Vote'
 *                 message:
 *                   type: string
 *                   example: Voto emitido exitosamente
 *       400:
 *         description: El votante ya votó o datos inválidos
 *       404:
 *         description: Votante o candidato no encontrado
 */
router.post('/', authMiddleware,voteController.castVote);

/**
 * @openapi
 * /api/votes:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Listar todos los votos
 *     description: Obtiene todos los votos con información del votante y candidato
 *     responses:
 *       200:
 *         description: Lista de votos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 */
router.get('/', voteController.getAllVotes);

/**
 * @openapi
 * /api/votes/statistics:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Estadísticas de votación
 *     description: Obtiene estadísticas completas del sistema de votación
 *     responses:
 *       200:
 *         description: Estadísticas de votación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VotingStatistics'
 */
router.get('/statistics', voteController.getStatistics);

/**
 * @openapi
 * /api/votes/voter/{voter_id}:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Obtener voto de un votante
 *     description: Verifica si un votante específico ha votado y obtiene su voto
 *     parameters:
 *       - in: path
 *         name: voter_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del votante
 *     responses:
 *       200:
 *         description: Información del voto o null si no ha votado
 */
router.get('/voter/:voter_id', voteController.getVoteByVoterId);

/**
 * @openapi
 * /api/votes/{id}:
 *   get:
 *     tags:
 *       - Votes
 *     summary: Obtener voto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Voto encontrado
 *       404:
 *         description: Voto no encontrado
 */
router.get('/:id', voteController.getVoteById);

export default router;