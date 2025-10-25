import { Router } from 'express';
import { VoterController } from './voter.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const voterController = new VoterController();

/**
 * @openapi
 * /api/voters:
 *   post:
 *     tags:
 *       - Voters
 *     summary: Crear nuevo votante
 *     description: Registra un nuevo votante en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVoterInput'
 *     responses:
 *       201:
 *         description: Votante creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Voter'
 *                 message:
 *                   type: string
 *                   example: Votante creado exitosamente
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email ya existe
 */
router.post('/', voterController.createVoter);

/**
 * @openapi
 * /api/voters:
 *   get:
 *     tags:
 *       - Voters
 *     summary: Listar votantes
 *     description: Obtiene lista paginada de votantes
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: has_voted
 *         schema:
 *           type: boolean
 *         description: Filtrar por si ha votado o no
 *     responses:
 *       200:
 *         description: Lista de votantes
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
 *                     $ref: '#/components/schemas/Voter'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     nextCursor:
 *                       type: string
 *                       nullable: true
 *                     hasMore:
 *                       type: boolean
 *                     totalCount:
 *                       type: integer
 */
router.get('/', voterController.getVoters);

/**
 * @openapi
 * /api/voters/stats:
 *   get:
 *     tags:
 *       - Voters
 *     summary: Estadísticas de votantes
 *     description: Obtiene estadísticas generales de votantes
 *     responses:
 *       200:
 *         description: Estadísticas de votantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     voted:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     participationRate:
 *                       type: string
 */
router.get('/stats', voterController.getVoterStats);

/**
 * @openapi
 * /api/voters/{id}:
 *   get:
 *     tags:
 *       - Voters
 *     summary: Obtener votante por ID
 *     description: Obtiene los detalles de un votante específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del votante
 *     responses:
 *       200:
 *         description: Votante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Voter'
 *       404:
 *         description: Votante no encontrado
 */
router.get('/:id', voterController.getVoterById);

/**
 * @openapi
 * /api/voters/{id}:
 *   patch:
 *     tags:
 *       - Voters
 *     summary: Actualizar votante
 *     description: Actualiza los datos de un votante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Votante actualizado
 *       404:
 *         description: Votante no encontrado
 */
router.patch('/:id', voterController.updateVoter);

/**
 * @openapi
 * /api/voters/{id}:
 *   delete:
 *     tags:
 *       - Voters
 *     summary: Eliminar votante
 *     description: Elimina un votante (solo si no ha votado)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Votante eliminado
 *       400:
 *         description: El votante ya votó y no puede ser eliminado
 *       404:
 *         description: Votante no encontrado
 */
router.delete('/:id',authMiddleware, voterController.deleteVoter);

export default router;