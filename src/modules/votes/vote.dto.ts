import { IsUUID, IsNotEmpty } from 'class-validator';

/**
 * DTOs para validación de requests de votos
 */

// DTO para emitir voto
export class CastVoteDto {
  @IsUUID('4', { message: 'voter_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'voter_id es requerido' })
  voter_id!: string;

  @IsUUID('4', { message: 'candidate_id debe ser un UUID válido' })
  @IsNotEmpty({ message: 'candidate_id es requerido' })
  candidate_id!: string;
}