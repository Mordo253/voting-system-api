import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // ============================================
  // Crear Candidatos
  // ============================================
  console.log('Creando candidatos...');

  const candidate1 = await prisma.candidate.create({
    data: {
      name: 'María García',
      party: 'Partido Verde',
      votes: 0,
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      name: 'Juan Pérez',
      party: 'Partido Azul',
      votes: 0,
    },
  });

  const candidate3 = await prisma.candidate.create({
    data: {
      name: 'Ana Martínez',
      party: 'Partido Rojo',
      votes: 0,
    },
  });

  const candidate4 = await prisma.candidate.create({
    data: {
      name: 'Carlos Rodríguez',
      party: null, // Candidato independiente
      votes: 0,
    },
  });

  console.log(`${4} candidatos creados `);

  // ============================================
  // Crear Votantes
  // ============================================
  console.log('-------------------------------------------');
  console.log('Creando votantes...');

  const voter1 = await prisma.voter.create({
    data: {
      name: 'Pedro López',
      email: 'pedro.lopez@example.com',
      has_voted: false,
    },
  });

  const voter2 = await prisma.voter.create({
    data: {
      name: 'Laura Fernández',
      email: 'laura.fernandez@example.com',
      has_voted: false,
    },
  });

  const voter3 = await prisma.voter.create({
    data: {
      name: 'Diego Sánchez',
      email: 'diego.sanchez@example.com',
      has_voted: false,
    },
  });

  const voter4 = await prisma.voter.create({
    data: {
      name: 'Sofía Ramírez',
      email: 'sofia.ramirez@example.com',
      has_voted: false,
    },
  });

  const voter5 = await prisma.voter.create({
    data: {
      name: 'Miguel Torres',
      email: 'miguel.torres@example.com',
      has_voted: false,
    },
  });
  console.log('-------------------------------------------');
  console.log(`${5} votantes creados `);
  console.log('Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });