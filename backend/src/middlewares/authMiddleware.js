import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { authRepository } from '../repositories/authRepository.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticação não fornecido.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await authRepository.findById(decoded.sub);

    if (!usuario || !usuario.ativo) {
      throw new AppError('Usuário não encontrado ou acesso desativado.', 401);
    }

    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Sessão expirada ou token inválido. Faça login novamente.', 401));
    }
    return next(error);
  }
}