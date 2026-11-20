import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Archive, ImageOff } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, extrairMensagemErro } from '../../utils/formatters';
import { AlertMessage } from '../../components/common/AlertMessage';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export function ImoveisListPage() {
  const [imoveis, setImoveis] = useState([]);
  const [dominios, setDominios] = useState({ finalidades: [], situacoes_imovel: [] });
  const [paginacao, setPaginacao] = useState({ pagina: 1, totalPaginas: 1, total: 0 });

  const [busca, setBusca] = useState('');
  const [finalidadeId, setFinalidadeId] = useState('');
  const [situacaoId, setSituacaoId] = useState('');
  const [publicado, setPublicado] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [imovelParaArquivar, setImovelParaArquivar] = useState(null);
  const [arquivando, setArquivando] = useState(false);

  useEffect(() => {
    api.get('/admin/imoveis/dominios').then(({ data }) => setDominios(data)).catch(() => {});
  }, []);

  async function carregarImoveis(paginaAlvo = 1) {
    setCarregando(true);
    try {
      const { data } = await api.get('/admin/imoveis', {
        params: {
          busca: busca || undefined,
          finalidade_id: finalidadeId || undefined,
          situacao_id: situacaoId || undefined,
          publicado: publicado || undefined,
          page: paginaAlvo,
          limit: 10,
        },
      });
      setImoveis(data.itens);
      setPaginacao({ pagina: data.pagina, totalPaginas: data.totalPaginas, total: data.total });
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao listar imóveis.') });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarImoveis(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalidadeId, situacaoId, publicado]);

  function handleBuscarSubmit(e) {
    e.preventDefault();
    carregarImoveis(1);
  }

  async function handleAlterarSituacao(imovelId, novaSituacaoId) {
    try {
      const { data } = await api.patch(`/admin/imoveis/${imovelId}/situacao`, {
        situacao_id: Number(novaSituacaoId),
      });
      setImoveis((prev) =>
        prev.map((item) => (item.id === imovelId ? { ...item, ...data } : item))
      );
      setFeedback({ tipo: 'success', mensagem: 'Situação do imóvel atualizada com sucesso.' });
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Falha ao atualizar situação.') });
    }
  }

  async function confirmarArquivamento() {
    if (!imovelParaArquivar) return;
    setArquivando(true);
    try {
      await api.delete(`/admin/imoveis/${imovelParaArquivar.id}`);
      setFeedback({
        tipo: 'success',
        mensagem: `Imóvel ${imovelParaArquivar.codigo_referencia} arquivado e removido do site público.`,
      });
      setImovelParaArquivar(null);
      carregarImoveis(paginacao.pagina);
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao arquivar imóvel.') });
    } finally {
      setArquivando(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Gerenciamento de Imóveis</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {paginacao.total} imóvel(is) encontrado(s)
          </p>
        </div>

        <Link to="/admin/imoveis/novo" className="btn btn-primary">
          <Plus size={18} />
          Cadastrar Imóvel
        </Link>
      </div>

      <AlertMessage tipo={feedback.tipo} mensagem={feedback.mensagem} />

      {/* Barra de Busca e Filtros */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleBuscarSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Pesquisar</label>
            <input
              type="text"
              className="form-control"
              placeholder="Título, código (VL-...), bairro ou cidade"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Finalidade</label>
            <select className="form-control" value={finalidadeId} onChange={(e) => setFinalidadeId(e.target.value)}>
              <option value="">Todas</option>
              {dominios.finalidades.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Situação</label>
            <select className="form-control" value={situacaoId} onChange={(e) => setSituacaoId(e.target.value)}>
              <option value="">Todas</option>
              {dominios.situacoes_imovel.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Visibilidade</label>
            <select className="form-control" value={publicado} onChange={(e) => setPublicado(e.target.value)}>
              <option value="">Todos</option>
              <option value="true">Publicados</option>
              <option value="false">Ocultos (Rascunho)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            Filtrar
          </button>
        </form>
      </div>

      {/* Tabela de Imóveis */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {carregando ? (
          <div style={{ padding: '3rem 0' }}><div className="spinner" /></div>
        ) : imoveis.length === 0 ? (
          <div className="empty-state">
            Nenhum imóvel encontrado com os filtros aplicados.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Código / Título</th>
                  <th>Localização</th>
                  <th>Valores</th>
                  <th>Situação</th>
                  <th>Publicação</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {imoveis.map((imovel) => (
                  <tr key={imovel.id}>
                    <td style={{ width: '76px' }}>
                      {imovel.foto_principal ? (
                        <img
                          src={imovel.foto_principal}
                          alt={imovel.titulo}
                          style={{ width: '60px', height: '46px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ) : (
                        <div style={{ width: '60px', height: '46px', borderRadius: '6px', backgroundColor: 'var(--color-neutral-bg)', display: 'grid', placeItems: 'center', color: 'var(--color-text-secondary)' }}>
                          <ImageOff size={18} />
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {imovel.codigo_referencia}
                      </span>
                      <div style={{ fontWeight: 600 }}>{imovel.titulo}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {imovel.tipo_nome} • {imovel.finalidade_nome}
                      </div>
                    </td>
                    <td>{imovel.bairro}, {imovel.cidade}</td>
                    <td className="tabular-nums" style={{ fontSize: '0.85rem' }}>
                      {imovel.preco_venda && <div>Venda: <strong>{formatCurrency(imovel.preco_venda)}</strong></div>}
                      {imovel.preco_locacao && <div>Locação: <strong>{formatCurrency(imovel.preco_locacao)}</strong></div>}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.84rem', width: '135px' }}
                        value={imovel.situacao_id}
                        onChange={(e) => handleAlterarSituacao(imovel.id, e.target.value)}
                      >
                        {dominios.situacoes_imovel.map((s) => (
                          <option key={s.id} value={s.id}>{s.nome}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span
                        className={`badge ${imovel.publicado && imovel.situacao_codigo === 'DISPONIVEL' ? 'badge-disponivel' : 'badge-vendido'}`}
                      >
                        {imovel.publicado && imovel.situacao_codigo === 'DISPONIVEL'
                          ? 'No Site'
                          : 'Fora do Site'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link to={`/admin/imoveis/${imovel.id}/editar`} className="btn btn-secondary btn-sm" title="Editar imóvel">
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-danger-text)' }}
                          title="Arquivar imóvel"
                          onClick={() => setImovelParaArquivar(imovel)}
                        >
                          <Archive size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {paginacao.totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={paginacao.pagina <= 1}
            onClick={() => carregarImoveis(paginacao.pagina - 1)}
          >
            Anterior
          </button>
          <span style={{ alignSelf: 'center', fontSize: '0.88rem', padding: '0 0.5rem' }}>
            Página {paginacao.pagina} de {paginacao.totalPaginas}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={paginacao.pagina >= paginacao.totalPaginas}
            onClick={() => carregarImoveis(paginacao.pagina + 1)}
          >
            Próxima
          </button>
        </div>
      )}

      <ConfirmModal
        aberto={Boolean(imovelParaArquivar)}
        titulo="Confirmar arquivamento do imóvel"
        descricao={`Deseja arquivar o imóvel "${imovelParaArquivar?.titulo}" (${imovelParaArquivar?.codigo_referencia})? Ele será retirado imediatamente do catálogo público.`}
        textoConfirmar="Arquivar Imóvel"
        carregando={arquivando}
        onCancelar={() => setImovelParaArquivar(null)}
        onConfirmar={confirmarArquivamento}
      />
    </div>
  );
}