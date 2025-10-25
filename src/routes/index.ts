import { Router } from 'express';
import voterRoutes from '../modules/voters/voter.routes';
import candidateRoutes from '../modules/candidates/candidate.routes';
import voteRoutes from '../modules/votes/vote.routes';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Verifica que la API esté funcionando correctamente
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API funcionando correctamente
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @openapi
 * tags:
 *   - name: Voters
 *     description: Endpoints para gestión de votantes
 *   - name: Candidates
 *     description: Endpoints para gestión de candidatos
 *   - name: Votes
 *     description: Endpoints para emisión de votos y estadísticas
 */

router.use('/voters', voterRoutes);
router.use('/candidates', candidateRoutes);
router.use('/votes', voteRoutes);
router.use('/auth', authRoutes); 
export default router;