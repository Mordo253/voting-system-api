import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

/**
 * Configuración de Swagger/OpenAPI
 */

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Votaciones API',
      version: '1.0.0',
      description: 'API RESTful para gestión de sistema de votaciones con PostgreSQL, Prisma y TypeScript',
      contact: {
        name: 'Esteban Arango Blandón',
        email: 'estebandesarrollo1548@email.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api-produccion.com', // Cambiar rn caso de tener URL de producción
        description: 'Servidor de producción',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Auth',
        description: 'Autenticación y registro',
      },
      {
        name: 'Voters',
        description: 'Gestión de votantes',
      },
      {
        name: 'Candidates',
        description: 'Gestión de candidatos',
      },
      {
        name: 'Votes',
        description: 'Emisión de votos y estadísticas',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Voter
        Voter: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com',
            },
            has_voted: {
              type: 'boolean',
              example: false,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateVoterInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 255,
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com',
            },
          },
        },
        // Candidate
        Candidate: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'María García',
            },
            party: {
              type: 'string',
              nullable: true,
              example: 'Partido Verde',
            },
            votes: {
              type: 'integer',
              example: 0,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateCandidateInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 255,
              example: 'María García',
            },
            party: {
              type: 'string',
              maxLength: 255,
              example: 'Partido Verde',
            },
          },
        },
        // Vote
        Vote: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            voter_id: {
              type: 'string',
              format: 'uuid',
            },
            candidate_id: {
              type: 'string',
              format: 'uuid',
            },
            voted_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CastVoteInput: {
          type: 'object',
          required: ['voter_id', 'candidate_id'],
          properties: {
            voter_id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            candidate_id: {
              type: 'string',
              format: 'uuid',
              example: '660e9511-f30c-52e5-b827-557766551111',
            },
          },
        },
        // Statistics
        VotingStatistics: {
          type: 'object',
          properties: {
            total_votes: {
              type: 'integer',
              example: 150,
            },
            total_voters: {
              type: 'integer',
              example: 200,
            },
            voters_who_voted: {
              type: 'integer',
              example: 150,
            },
            participation_rate: {
              type: 'string',
              example: '75.00',
            },
            candidates_statistics: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  candidate_id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  candidate_name: {
                    type: 'string',
                  },
                  party: {
                    type: 'string',
                    nullable: true,
                  },
                  total_votes: {
                    type: 'integer',
                  },
                  percentage: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        // Responses
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
            message: {
              type: 'string',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/modules/*/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);