import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import router from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './shared/utils/logger';
import { swaggerSpec } from './config/swagger'; 

/**
 * Configuración de Express
 * Middlewares, rutas y manejo de errores
 */

const app: Application = express();

// ============================================
// Middlewares de Seguridad
// ============================================

// Helmet: Headers de seguridad HTTP
app.use(helmet());

// CORS: Permitir peticiones cross-origin
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? [] : '*', // En producción, especificar dominios permitidos
    credentials: true,
  })
);

// ============================================
// Middlewares de Parseo
// ============================================

// Parsear body JSON
app.use(express.json());

// Parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// Logging
// ============================================

// Morgan: Log de requests HTTP
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// Rate Limiting
// ============================================

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutos por defecto
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests por defecto
  message: {
    success: false,
    error: 'Demasiadas peticiones, por favor intenta más tarde',
    statusCode: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Aplicar rate limiting a todas las rutas
app.use(limiter);

// ============================================
// Rutas
// ============================================
/**
 * Swagger UI
 * Documentación interactiva en /api-docs
 */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sistema de Votaciones API Docs',
  })
);

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

logger.info('* Swagger docs disponible en: /api-docs');

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Votaciones API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      voters: '/api/voters',
      candidates: '/api/candidates (próximamente)',
      votes: '/api/votes (próximamente)',
      docs: '/api-docs (próximamente)',
    },
  });
});

// Rutas de la API
app.use('/api', router);

// ============================================
// Manejo de Errores
// ============================================

// 404 - Ruta no encontrada
app.use(notFoundHandler);

// Error handler global
app.use(errorHandler);

// ============================================
// Exportar app
// ============================================

export default app;