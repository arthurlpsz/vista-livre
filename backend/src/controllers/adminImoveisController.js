import { imovelSchema, alterarSituacaoSchema } from '../validators/imovelValidator.js';
import { imoveisService } from '../services/imoveisService.js';
import { dominiosRepository } from '../repositories/dominiosRepository.js';

export const adminImoveisController = {
  async dashboard(req, res, next) {
    try {
      const dados = await imoveisService.obterDashboard();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  },

  async dominios(req, res, next) {
    try {
      const dados = await dominiosRepository.listarDominios();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  },

  async listar(req, res, next) {
    try {
      const resultado = await imoveisService.listarAdmin(req.query);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  },

  async detalhar(req, res, next) {
    try {
      const imovel = await imoveisService.obterDetalhesAdmin(req.params.id);
      return res.json(imovel);
    } catch (error) {
      return next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const dados = imovelSchema.parse(req.body);
      const novoImovel = await imoveisService.criarImovel(dados, req.usuario.id);
      return res.status(201).json(novoImovel);
    } catch (error) {
      return next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const dados = imovelSchema.parse(req.body);
      const atualizado = await imoveisService.atualizarImovel(
        req.params.id,
        dados,
        req.usuario.id
      );
      return res.json(atualizado);
    } catch (error) {
      return next(error);
    }
  },

  async alterarSituacao(req, res, next) {
    try {
      const { situacao_id } = alterarSituacaoSchema.parse(req.body);
      const atualizado = await imoveisService.alterarSituacao(
        req.params.id,
        situacao_id,
        req.usuario.id
      );
      return res.json(atualizado);
    } catch (error) {
      return next(error);
    }
  },

  async arquivar(req, res, next) {
    try {
      await imoveisService.arquivarImovel(req.params.id, req.usuario.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  async uploadFotos(req, res, next) {
    try {
      const fotos = await imoveisService.adicionarFotos(req.params.id, req.files);
      return res.status(201).json({ fotos });
    } catch (error) {
      return next(error);
    }
  },

  async definirFotoPrincipal(req, res, next) {
    try {
      const fotos = await imoveisService.definirFotoPrincipal(req.params.id, req.params.fotoId);
      return res.json({ fotos });
    } catch (error) {
      return next(error);
    }
  },

  async removerFoto(req, res, next) {
    try {
      const fotos = await imoveisService.removerFoto(req.params.id, req.params.fotoId);
      return res.json({ fotos });
    } catch (error) {
      return next(error);
    }
  },
};