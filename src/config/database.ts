import { PrismaClient } from '@prisma/client';
import logger from '../shared/utils/logger';

/**
 * Cliente Prisma Singleton
 * Asegura una única instancia de PrismaClient en toda la aplicación
 * Evita múltiples conexiones a la base de datos
 */

// Extender el tipo global para desarrollo (hot-reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Configuración de Prisma con logs
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });
};

// En desarrollo, usar variable global para evitar múltiples instancias en hot-reload
// En producción, crear nueva instancia
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Log cuando se conecta exitosamente
prisma
  .$connect()
  .then(() => {
    logger.info('Conectado a la base de datos (Supabase)');
  })
  .catch((error) => {
    logger.error('Error conectando a la base de datos:', error);
    process.exit(1);
  });

// Manejar cierre graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Desconectado de la base de datos');
});

export default prisma;