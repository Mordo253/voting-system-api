import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTOs para autenticación
 */

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email requerido' })
  email!: string;

  @IsString({ message: 'Password debe ser string' })
  @IsNotEmpty({ message: 'Password requerido' })
  @MinLength(6, { message: 'Password mínimo 6 caracteres' })
  password!: string;
}

export class RegisterDto {
  @IsString({ message: 'Nombre debe ser string' })
  @IsNotEmpty({ message: 'Nombre requerido' })
  @MinLength(3, { message: 'Nombre mínimo 3 caracteres' })
  name!: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email requerido' })
  email!: string;

  @IsString({ message: 'Password debe ser string' })
  @IsNotEmpty({ message: 'Password requerido' })
  @MinLength(6, { message: 'Password mínimo 6 caracteres' })
  password!: string;
}