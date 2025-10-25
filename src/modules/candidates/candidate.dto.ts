import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

/**
 * DTOs para validación de requests de candidatos
 */

// DTO para crear candidato
export class CreateCandidateDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name!: string;

  @IsString({ message: 'El partido debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(255, { message: 'El partido no puede exceder 255 caracteres' })
  party?: string;
}

// DTO para actualizar candidato
export class UpdateCandidateDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name?: string;

  @IsString({ message: 'El partido debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(255, { message: 'El partido no puede exceder 255 caracteres' })
  party?: string;
}

// DTO para query parameters de listado
export class ListCandidatesQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  party?: string; // Filtrar por partido

  @IsOptional()
  @IsString()
  search?: string; // Buscar por nombre

  @IsOptional()
  @IsInt()
  @Min(0)
  minVotes?: number; // Filtrar por mínimo de votos
}