import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/authRepository.js';
import { AppError } from '../utils/AppError.js';

export const authService = {
  async login({ email, senha }) {
    const usuario = await authRepository.findByEmail(email);

    if (!usuario) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    if (!usuario.ativo) {
      throw new AppError('Esta conta está desativada. Contate o administrador.', 403);
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaConfere) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const token = jwt.sign(
      {
        sub: usuario.id,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  },
};