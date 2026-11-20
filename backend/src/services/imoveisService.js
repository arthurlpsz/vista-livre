import { pool } from '../config/database.js';
import { imoveisRepository } from '../repositories/imoveisRepository.js';
import { dominiosRepository } from '../repositories/dominiosRepository.js';
import { fotosRepository } from '../repositories/fotosRepository.js';
import { storageService } from './storageService.js';
import { AppError } from '../utils/AppError.js';

function validarPrecosPorFinalidade(finalidadeCodigo, dados) {
  if (finalidadeCodigo === 'VENDA' && !dados.preco_venda) {
    throw new AppError('Informe o preço de venda para imóveis com finalidade Venda.', 400);
  }
  if (finalidadeCodigo === 'LOCACAO' && !dados.preco_locacao) {
    throw new AppError('Informe o valor de locação para imóveis com finalidade Locação.', 400);
  }
  if (finalidadeCodigo === 'AMBAS' && (!dados.preco_venda || !dados.preco_locacao)) {
    throw new AppError(
      'Informe tanto o preço de venda quanto o de locação para finalidade Venda e Locação.',
      400
    );
  }
}

export const imoveisService = {
  async obterDashboard() {
    return imoveisRepository.obterResumoDashboard();
  },

  async listarAdmin(filtros) {
    return imoveisRepository.listarAdmin(filtros);
  },

  async obterDetalhesAdmin(id) {
    const imovel = await imoveisRepository.findByIdAdmin(id);
    if (!imovel) {
      throw new AppError('Imóvel não encontrado.', 404);
    }
    const fotos = await fotosRepository.listarPorImovel(id);
    return { ...imovel, fotos };
  },

  async criarImovel(dados, usuarioId) {
    const finalidade = await dominiosRepository.findFinalidadeById(dados.finalidade_id);
    if (!finalidade) {
      throw new AppError('Finalidade selecionada é inválida.', 400);
    }

    const situacao = await dominiosRepository.findSituacaoById(dados.situacao_id);
    if (!situacao) {
      throw new AppError('Situação selecionada é inválida.', 400);
    }

    validarPrecosPorFinalidade(finalidade.codigo, dados);

    const novoImovel = await imoveisRepository.criar(dados, usuarioId);
    return { ...novoImovel, fotos: [] };
  },

  async atualizarImovel(id, dados, usuarioId) {
    const existente = await imoveisRepository.findByIdAdmin(id);
    if (!existente) {
      throw new AppError('Imóvel não encontrado.', 404);
    }

    const finalidade = await dominiosRepository.findFinalidadeById(dados.finalidade_id);
    if (!finalidade) {
      throw new AppError('Finalidade selecionada é inválida.', 400);
    }

    validarPrecosPorFinalidade(finalidade.codigo, dados);

    const atualizado = await imoveisRepository.atualizar(id, dados, usuarioId);
    const fotos = await fotosRepository.listarPorImovel(id);
    return { ...atualizado, fotos };
  },

  async alterarSituacao(id, situacaoId, usuarioId) {
    const situacao = await dominiosRepository.findSituacaoById(situacaoId);
    if (!situacao) {
      throw new AppError('Situação inválida.', 400);
    }

    const atualizado = await imoveisRepository.atualizarSituacao(id, situacaoId, usuarioId);
    if (!atualizado) {
      throw new AppError('Imóvel não encontrado.', 404);
    }
    return atualizado;
  },

  async arquivarImovel(id, usuarioId) {
    const arquivado = await imoveisRepository.arquivar(id, usuarioId);
    if (!arquivado) {
      throw new AppError('Imóvel não encontrado ou já arquivado.', 404);
    }
  },

  async adicionarFotos(imovelId, files) {
    if (!files || files.length === 0) {
      throw new AppError('Nenhuma fotografia foi enviada.', 400);
    }

    const imovel = await imoveisRepository.findByIdAdmin(imovelId);
    if (!imovel) {
      throw new AppError('Imóvel não encontrado.', 404);
    }

    const fotosExistentes = await fotosRepository.listarPorImovel(imovelId);
    let jaPossuiPrincipal = fotosExistentes.some((f) => f.is_principal);
    let proximaOrdem = fotosExistentes.length;

    const fotosSalvas = [];

    for (const file of files) {
      const { url, storageKey } = await storageService.uploadImagemImovel(imovelId, file);
      const deveSerPrincipal = !jaPossuiPrincipal;

      const registro = await fotosRepository.inserirFoto({
        imovelId,
        url,
        storageKey,
        isPrincipal: deveSerPrincipal,
        ordem: proximaOrdem++,
      });

      if (deveSerPrincipal) {
        jaPossuiPrincipal = true;
      }

      fotosSalvas.push(registro);
    }

    return fotosRepository.listarPorImovel(imovelId);
  },

  async definirFotoPrincipal(imovelId, fotoId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const foto = await fotosRepository.findById(fotoId, imovelId, client);
      if (!foto) {
        throw new AppError('Fotografia não encontrada para este imóvel.', 404);
      }

      await fotosRepository.definirPrincipal(imovelId, fotoId, client);
      await client.query('COMMIT');

      return fotosRepository.listarPorImovel(imovelId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async removerFoto(imovelId, fotoId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const foto = await fotosRepository.excluirFoto(fotoId, imovelId, client);
      if (!foto) {
        throw new AppError('Fotografia não encontrada.', 404);
      }

      // Se a foto excluída era a principal, promove a próxima foto restante automaticamente
      if (foto.is_principal) {
        const restantes = await fotosRepository.listarPorImovel(imovelId, client);
        if (restantes.length > 0) {
          await fotosRepository.definirPrincipal(imovelId, restantes[0].id, client);
        }
      }

      await client.query('COMMIT');

      await storageService.removerImagemImovel(foto.storage_key);
      return fotosRepository.listarPorImovel(imovelId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // =========================================================================
  // REGRAS DO SITE PÚBLICO
  // =========================================================================

  async listarPublico(filtros) {
    return imoveisRepository.listarPublico(filtros);
  },

  async obterDetalhesPublico(codigo) {
    const imovel = await imoveisRepository.findByCodigoPublico(codigo);
    if (!imovel) {
      throw new AppError('Imóvel não encontrado ou indisponível no momento.', 404);
    }

    const fotos = await fotosRepository.listarPorImovel(imovel.id);

    // Proteção de privacidade: oculta endereço exato se não autorizado para divulgação
    if (!imovel.exibir_endereco_completo) {
      imovel.logradouro = null;
      imovel.numero = null;
      imovel.complemento = null;
      imovel.cep = null;
    }

    return {
      ...imovel,
      fotos: fotos.map(({ id, url, legenda, is_principal, ordem }) => ({
        id,
        url,
        legenda,
        is_principal,
        ordem,
      })),
    };
  },
};