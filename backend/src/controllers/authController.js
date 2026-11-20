import { loginSchema } from '../validators/authValidator.js';
import { authService } from '../services/authService.js';

export const authController = {
  async login(req, res, next) {
    try {
      const dados = loginSchema.parse(req.body);
      const resultado = await authService.login(dados);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  },

  async perfil(req, res) {
    return res.json({ usuario: req.usuario });
  },
};