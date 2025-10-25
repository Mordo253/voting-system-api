/**
 * Mensajes de error centralizados
 * Facilita mantenimiento y traducción futura
 */

export const ERROR_MESSAGES = {
  // Votantes
  VOTER_NOT_FOUND: 'Votante no encontrado',
  VOTER_EMAIL_EXISTS: 'Ya existe un votante con este email',
  VOTER_ALREADY_VOTED: 'El votante ya emitió su voto',
  VOTER_HAS_VOTED_CANNOT_DELETE:
    'No se puede eliminar un votante que ya ha votado',
  VOTER_IS_CANDIDATE: 'Este email está registrado como candidato',

  // Candidatos
  CANDIDATE_NOT_FOUND: 'Candidato no encontrado',
  CANDIDATE_NAME_EXISTS: 'Ya existe un candidato con este nombre',
  CANDIDATE_HAS_VOTES_CANNOT_DELETE:
    'No se puede eliminar un candidato que tiene votos',
  CANDIDATE_IS_VOTER: 'Este nombre está registrado como votante',

  // Votos
  VOTE_NOT_FOUND: 'Voto no encontrado',
  VOTE_ALREADY_EXISTS: 'Este votante ya emitió su voto',
  INVALID_VOTER_OR_CANDIDATE: 'Votante o candidato inválido',

  // Validación
  INVALID_UUID: 'ID inválido',
  INVALID_EMAIL: 'Email inválido',
  REQUIRED_FIELD: 'Campo requerido',
  INVALID_REQUEST: 'Petición inválida',

  // Autenticación
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  TOKEN_EXPIRED: 'Token expirado',
  TOKEN_INVALID: 'Token inválido',
  UNAUTHORIZED: 'No autorizado',

  // General
  INTERNAL_ERROR: 'Error interno del servidor',
  NOT_FOUND: 'Recurso no encontrado',
  DATABASE_ERROR: 'Error en la base de datos',
};