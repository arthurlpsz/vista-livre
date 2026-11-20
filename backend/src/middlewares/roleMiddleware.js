import { AppError } from '../utils/AppError.js';

export function authorizeRoles(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('Usuário não autenticado.', 401));
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return next(new AppError('Você não tem permissão para executar esta operação.', 403));
    }

    return next();
  };
}