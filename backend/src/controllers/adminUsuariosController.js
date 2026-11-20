import { criarUsuarioSchema, atualizarUsuarioSchema } from '../validators/usuarioValidator.js';
import { usuariosService } from '../services/usuariosService.js';

export const adminUsuariosController = {
  async listar(req, res, next) {
    try {
      const usuarios = await usuariosService.listar();
      return res.json({ usuarios });
    } catch (error) {
      return next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const dados = criarUsuarioSchema.parse(req.body);
      const novo = await usuariosService.criar(dados);
      return res.status(201).json(novo);
    } catch (error) {
      return next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const dados = atualizarUsuarioSchema.parse(req.body);
      const atualizado = await usuariosService.atualizar(req.params.id, dados, req.usuario.id);
      return res.json(atualizado);
    } catch (error) {
      return next(error);
    }
  },
};