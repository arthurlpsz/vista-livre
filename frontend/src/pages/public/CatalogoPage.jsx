import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';
import { PropertyCard } from '../../components/public/PropertyCard';

export function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [imoveis, setImoveis] = useState([]);
  const [opcoes, setOpcoes] = useState({ locais: [], tipos_imovel: [], finalidades: [] });
  const [paginacao, setPaginacao] = useState({ pagina: 1, totalPaginas: 1, total: 0 });
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [finalidade, setFinalidade] = useState(searchParams.get('finalidade') || '');
  const [tipoImovelId, setTipoImovelId] = useState(searchParams.get('tipo_imovel_id') || '');
  const [cidade, setCidade] = useState(searchParams.get('cidade') || '');
  const [bairro, setBairro] = useState(searchParams.get('bairro') || '');
  const [precoMin, setPrecoMin] = useState(searchParams.get('preco_min') || '');
  const [precoMax, setPrecoMax] = useState(searchParams.get('preco_max') || '');
  const [ordenar, setOrdenar] = useState(searchParams.get('ordenar') || 'recentes');

  useEffect(() => {
    api.get('/public/filtros').then(({ data }) => setOpcoes(data)).catch(() => {});
  }, []);

  const cidadesUnicas = [...new Set(opcoes.locais.map((l) => l.cidade))];
  const bairrosDisponiveis = opcoes.locais
    .filter((l) => !cidade || l.cidade.toLowerCase() === cidade.toLowerCase())
    .map((l) => l.bairro);

  async function buscarCatalogo(paginaAlvo = 1, filtrosCustomizados = null) {
    setCarregando(true);
    const f = filtrosCustomizados || {
      busca,
      finalidade,
      tipoImovelId,
      cidade,
      bairro,
      precoMin,
      precoMax,
      ordenar,
    };

    try {
      const { data } = await api.get('/public/imoveis', {
        params: {
          busca: f.busca || undefined,
          finalidade: f.finalidade || undefined,
          tipo_imovel_id: f.tipoImovelId || undefined,
          cidade: f.cidade || undefined,
          bairro: f.bairro || undefined,
          preco_min: f.precoMin || undefined,
          preco_max: f.precoMax || undefined,
          ordenar: f.ordenar || 'recentes',
          page: paginaAlvo,
          limit: 9,
        },
      });
      setImoveis(data.itens);
      setPaginacao({ pagina: data.pagina, totalPaginas: data.totalPaginas, total: data.total });
    } catch {
      setImoveis([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarCatalogo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalidade, tipoImovelId, cidade, bairro, ordenar]);

  function handleFiltrarSubmit(e) {
    e.preventDefault();
    const nextParams = {};
    if (busca) nextParams.busca = busca;
    if (finalidade) nextParams.finalidade = finalidade;
    if (tipoImovelId) nextParams.tipo_imovel_id = tipoImovelId;
    if (cidade) nextParams.cidade = cidade;
    if (bairro) nextParams.bairro = bairro;
    if (precoMin) nextParams.preco_min = precoMin;
    if (precoMax) nextParams.preco_max = precoMax;
    setSearchParams(nextParams);
    buscarCatalogo(1);
  }

  function limparFiltros() {
    const limpo = {
      busca: '',
      finalidade: '',
      tipoImovelId: '',
      cidade: '',
      bairro: '',
      precoMin: '',
      precoMax: '',
      ordenar: 'recentes',
    };
    setBusca('');
    setFinalidade('');
    setTipoImovelId('');
    setCidade('');
    setBairro('');
    setPrecoMin('');
    setPrecoMax('');
    setOrdenar('recentes');
    setSearchParams({});
    buscarCatalogo(1, limpo);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-primary)' }}>Catálogo de Imóveis</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {paginacao.total} imóvel(is) disponível(is) para consulta
        </p>
      </div>

      {/* Painel de Filtros */}
      <form onSubmit={handleFiltrarSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-grid" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Palavra-chave ou Código</label>
            <input
              type="text"
              className="form-control"
              placeholder="Título, bairro ou VL-..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Finalidade</label>
            <select className="form-control" value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
              <option value="">Todas</option>
              <option value="VENDA">Venda</option>
              <option value="LOCACAO">Locação</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Imóvel</label>
            <select className="form-control" value={tipoImovelId} onChange={(e) => setTipoImovelId(e.target.value)}>
              <option value="">Todos</option>
              {opcoes.tipos_imovel.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cidade</label>
            <select
              className="form-control"
              value={cidade}
              onChange={(e) => {
                setCidade(e.target.value);
                setBairro('');
              }}
            >
              <option value="">Todas</option>
              {cidadesUnicas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bairro</label>
            <select className="form-control" value={bairro} onChange={(e) => setBairro(e.target.value)}>
              <option value="">Todos</option>
              {[...new Set(bairrosDisponiveis)].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preço Mínimo (R$)</label>
            <input type="number" min="0" className="form-control" value={precoMin} onChange={(e) => setPrecoMin(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Preço Máximo (R$)</label>
            <input type="number" min="0" className="form-control" value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Ordenar por</label>
            <select className="form-control" value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
              <option value="recentes">Mais recentes</option>
              <option value="menor_preco">Menor preço</option>
              <option value="maior_preco">Maior preço</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={limparFiltros}>
            <RotateCcw size={15} />
            Limpar Filtros
          </button>
          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            Aplicar Filtros
          </button>
        </div>
      </form>

      {/* Resultados */}
      {carregando ? (
        <div style={{ padding: '4rem 0' }}><div className="spinner" /></div>
      ) : imoveis.length === 0 ? (
        <div className="card empty-state">
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhum imóvel encontrado</h3>
          <p style={{ marginBottom: '1.25rem' }}>
            Não encontramos imóveis disponíveis com os critérios selecionados. Tente ampliar a faixa de preço ou limpar os filtros.
          </p>
          <button type="button" className="btn btn-primary" onClick={limparFiltros}>
            Ver todos os imóveis disponíveis
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {imoveis.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))}
          </div>

          {paginacao.totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '2.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={paginacao.pagina <= 1}
                onClick={() => buscarCatalogo(paginacao.pagina - 1)}
              >
                Anterior
              </button>
              <span style={{ alignSelf: 'center', fontSize: '0.9rem', padding: '0 0.5rem' }}>
                Página {paginacao.pagina} de {paginacao.totalPaginas}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={paginacao.pagina >= paginacao.totalPaginas}
                onClick={() => buscarCatalogo(paginacao.pagina + 1)}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}