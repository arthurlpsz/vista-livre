import { imoveisService } from '../services/imoveisService.js';
import { imoveisRepository } from '../repositories/imoveisRepository.js';

export const publicController = {
  async listarImoveis(req, res, next) {
    try {
      const resultado = await imoveisService.listarPublico(req.query);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  },

  async detalharImovel(req, res, next) {
    try {
      const imovel = await imoveisService.obterDetalhesPublico(req.params.codigo);
      return res.json(imovel);
    } catch (error) {
      return next(error);
    }
  },

  async obterOpcoesFiltro(req, res, next) {
    try {
      const opcoes = await imoveisRepository.listarOpcoesFiltroPublico();
      return res.json(opcoes);
    } catch (error) {
      return next(error);
    }
  },
};