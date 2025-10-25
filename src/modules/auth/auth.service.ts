import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../shared/utils/ApiError';
import { LoginInput, RegisterInput, AuthResponse, JWTPayload } from './auth.types';
import prisma from '../../config/database';

export class AuthService {
  /**
   * Registrar nuevo usuario (votante)
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingVoter = await prisma.voter.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingVoter) {
      throw ApiError.conflict('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const voter = await prisma.voter.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
      },
    });

    const token = this.generateToken({
      user_id: voter.id,
      email: voter.email,
      role: 'voter',
    });

    return {
      token,
      user: {
        id: voter.id,
        name: voter.name,
        email: voter.email,
        role: 'voter',
      },
    };
  }

  /**
   * Login
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    const voter = await prisma.voter.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!voter) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    const token = this.generateToken({
      user_id: voter.id,
      email: voter.email,
      role: 'voter',
    });

    return {
      token,
      user: {
        id: voter.id,
        name: voter.name,
        email: voter.email,
        role: 'voter',
      },
    };
  }

  /**
 * Generar JWT token
 */
private generateToken(payload: JWTPayload): string {
  const secret = String(env.JWT_SECRET);
  const expiresIn = String(env.JWT_EXPIRES_IN);
  
  // Agregar expiresIn al payload directamente
  const payloadWithExp = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas en segundos
  };
  
  return jwt.sign(payloadWithExp, secret);
}

  /**
   * Verificar JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      const secret = String(env.JWT_SECRET);
      const decoded = jwt.verify(token, secret);
      return decoded as JWTPayload;
    } catch (error) {
      throw ApiError.unauthorized('Token inválido o expirado');
    }
  }
}