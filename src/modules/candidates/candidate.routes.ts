import { Router } from 'express';
import { CandidateController } from './candidate.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const candidateController = new CandidateController();

/**
 * @openapi
 * /api/candidates:
 *   post:
 *     tags:
 *       - Candidates
 *     summary: Crear nuevo candidato
 *     description: Registra un nuevo candidato en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateInput'
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *                 message:
 *                   type: string
 *       409:
 *         description: Nombre ya existe
 */
router.post('/', candidateController.createCandidate);

/**
 * @openapi
 * /api/candidates:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Listar candidatos
 *     description: Obtiene lista paginada de candidatos
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: party
 *         schema:
 *           type: string
 *         description: Filtrar por partido
 *       - in: query
 *         name: minVotes
 *         schema:
 *           type: integer
 *         description: Mínimo de votos
 *     responses:
 *       200:
 *         description: Lista de candidatos
 */
router.get('/', candidateController.getCandidates);

/**
 * @openapi
 * /api/candidates/ranking:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Ranking de candidatos
 *     description: Obtiene candidatos ordenados por cantidad de votos
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Ranking de candidatos
 */
router.get('/ranking', candidateController.getRanking);

/**
 * @openapi
 * /api/candidates/stats:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Estadísticas de candidatos
 *     description: Obtiene estadísticas generales de candidatos
 *     responses:
 *       200:
 *         description: Estadísticas de candidatos
 */
router.get('/stats', candidateController.getCandidateStats);

/**
 * @openapi
 * /api/candidates/{id}:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Obtener candidato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Candidato encontrado
 *       404:
 *         description: Candidato no encontrado
 */
router.get('/:id', candidateController.getCandidateById);

/**
 * @openapi
 * /api/candidates/{id}:
 *   patch:
 *     tags:
 *       - Candidates
 *     summary: Actualizar candidato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               party:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidato actualizado
 */
router.patch('/:id', candidateController.updateCandidate);

/**
 * @openapi
 * /api/candidates/{id}:
 *   delete:
 *     tags:
 *       - Candidates
 *     summary: Eliminar candidato
 *     description: Elimina un candidato (solo si no tiene votos)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Candidato eliminado
 *       400:
 *         description: El candidato tiene votos y no puede ser eliminado
 */
router.delete('/:id', authMiddleware,candidateController.deleteCandidate);

export default router;