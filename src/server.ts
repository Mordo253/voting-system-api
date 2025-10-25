import app from './app';
import { env } from './config/env';
import logger from './shared/utils/logger';
import prisma from './config/database';

/**
 * Entry point de la aplicación
 * Inicia el servidor HTTP
 */

const PORT = env.PORT || 3000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  logger.info(`* Servidor corriendo en puerto ${PORT}`);
  logger.info(`* Ambiente: ${env.NODE_ENV}`);
  logger.info(`* API disponible en: http://localhost:${PORT}/api`);
  logger.info(`* Health check: http://localhost:${PORT}/api/health`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  // Cerrar servidor gracefully
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Manejo de señales de terminación (graceful shutdown)
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido, cerrando servidor...');
  
  server.close(async () => {
    logger.info('Servidor cerrado');
    
    // Desconectar Prisma
    await prisma.$disconnect();
    logger.info('Base de datos desconectada');
    
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recibido, cerrando servidor...');
  
  server.close(async () => {
    logger.info('Servidor cerrado');
    
    await prisma.$disconnect();
    logger.info('Base de datos desconectada');
    
    process.exit(0);
  });
});

export default server;