import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Maximize2,
  BedDouble,
  Car,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { PropertyCard } from '../../components/public/PropertyCard';
import { formatCurrency, formatArea } from '../../utils/formatters';
import logoVistaLivre from '../../assets/vistalivre_logo.png';;

export function HomePage() {
  const navigate = useNavigate();
  const [destaques, setDestaques] = useState([]);
  const [opcoesFiltro, setOpcoesFiltro] = useState({ tipos_imovel: [], locais: [] });
  const [carregando, setCarregando] = useState(true);

  const [finalidade, setFinalidade] = useState('');
  const [tipoImovelId, setTipoImovelId] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function carregarDadosHome() {
      try {
        const [destaquesRes, filtrosRes] = await Promise.all([
          api.get('/public/imoveis', { params: { destaque: 'true', limit: 7 } }),
          api.get('/public/filtros'),
        ]);

        if (destaquesRes.data.itens.length > 0) {
          setDestaques(destaquesRes.data.itens);
        } else {
          const recentesRes = await api.get('/public/imoveis', { params: { limit: 7 } });
          setDestaques(recentesRes.data.itens);
        }

        setOpcoesFiltro(filtrosRes.data);
      } catch {
        // Mantém a página estável
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosHome();
  }, []);

  function handleBuscaRapida(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (finalidade) params.set('finalidade', finalidade);
    if (tipoImovelId) params.set('tipo_imovel_id', tipoImovelId);
    if (busca.trim()) params.set('busca', busca.trim());
    navigate(`/imoveis?${params.toString()}`);
  }

  const destaquePrincipal = destaques[0] || null;
  const demaisDestaques = destaques.slice(1);

  return (
    <div>
      {/* HERO EDITORIAL ASSIMÉTRICO */}
      <section className="home-hero">
        <svg
          className="home-hero-waves"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M-120 490C180 410 420 560 740 480C1060 400 1260 470 1560 420"
            stroke="#EBE0BA"
            strokeOpacity="0.11"
            strokeWidth="2"
          />
          <path
            d="M-120 535C200 455 440 605 760 525C1080 445 1280 515 1580 465"
            stroke="#EBE0BA"
            strokeOpacity="0.06"
            strokeWidth="2"
          />
        </svg>

        <div className="home-hero-container">
          <div>
            <span className="home-hero-kicker">Vista Livre Negócios Imobiliários</span>
            <h1 className="home-hero-title">
              Horizontes abertos para o seu próximo <span>endereço</span>
            </h1>
            <p className="home-hero-subtitle">
              Curadoria de imóveis residenciais e comerciais disponíveis para compra e locação, com acompanhamento transparente em cada etapa.
            </p>

            <form onSubmit={handleBuscaRapida} className="home-search-box">
              <div className="form-group">
                <label className="form-label">Finalidade</label>
                <select className="form-control" value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                  <option value="">Comprar ou Alugar</option>
                  <option value="VENDA">Comprar</option>
                  <option value="LOCACAO">Alugar</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-control" value={tipoImovelId} onChange={(e) => setTipoImovelId(e.target.value)}>
                  <option value="">Todos os tipos</option>
                  {opcoesFiltro.tipos_imovel.map((t) => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Localização ou Código</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bairro, cidade ou VL-..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary home-search-btn">
                <Search size={17} />
                Buscar
              </button>
            </form>
          </div>

          {/* Quadro Arquitetônico Lateral */}
          <div className="home-hero-frame">
            {destaquePrincipal ? (
              <Link
                to={`/imoveis/${destaquePrincipal.codigo_referencia}`}
                className="home-hero-spotlight-card"
              >
                <div className="home-hero-spotlight-media">
                  {destaquePrincipal.foto_principal && (
                    <img src={destaquePrincipal.foto_principal} alt={destaquePrincipal.titulo} />
                  )}
                  <span className="home-hero-spotlight-tag">
                    {destaquePrincipal.finalidade_nome} • {destaquePrincipal.codigo_referencia}
                  </span>
                </div>
                <div className="home-hero-spotlight-info">
                  <div className="home-hero-spotlight-loc">
                    <MapPin size={14} />
                    {destaquePrincipal.bairro}, {destaquePrincipal.cidade}
                  </div>
                  <h3 className="home-hero-spotlight-title">{destaquePrincipal.titulo}</h3>
                  <div className="home-hero-spotlight-bottom tabular-nums">
                    <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                      {destaquePrincipal.preco_venda
                        ? formatCurrency(destaquePrincipal.preco_venda)
                        : `${formatCurrency(destaquePrincipal.preco_locacao)}/mês`}
                    </strong>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      Detalhes <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="home-hero-brand-card">
                <img src={logoVistaLivre} alt="Logomarca Vista Livre Imóveis" />
                <h3>Vista Livre Imóveis</h3>
                <p>
                  Consulte nosso catálogo atualizado de imóveis disponíveis ou fale diretamente com nossa equipe comercial.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VITRINE DE IMÓVEIS SELECIONADOS */}
      <section className="home-section">
        <div className="home-section-header">
          <div>
            <div className="home-section-kicker">Portfólio Selecionado</div>
            <h2 className="home-section-title">Imóveis em Destaque</h2>
          </div>

          <Link to="/imoveis" className="btn btn-primary">
            Explorar catálogo completo
            <ArrowRight size={16} />
          </Link>
        </div>

        {carregando ? (
          <div style={{ padding: '3rem 0' }}><div className="spinner" /></div>
        ) : !destaquePrincipal ? (
          <div className="card empty-state">
            <p style={{ marginBottom: '1rem' }}>Nenhum imóvel publicado no catálogo até o momento.</p>
            <Link to="/imoveis" className="btn btn-primary btn-sm">Ir para o Catálogo</Link>
          </div>
        ) : (
          <>
            {/* Destaque Principal em Formato Banner Horizontal */}
            <article className="home-featured-banner">
              <Link to={`/imoveis/${destaquePrincipal.codigo_referencia}`} className="home-featured-banner-media">
                {destaquePrincipal.foto_principal && (
                  <img src={destaquePrincipal.foto_principal} alt={destaquePrincipal.titulo} />
                )}
              </Link>

              <div className="home-featured-banner-body">
                <div>
                  <span className="home-featured-tag">
                    Destaque • {destaquePrincipal.tipo_nome} ({destaquePrincipal.finalidade_nome})
                  </span>
                  <Link to={`/imoveis/${destaquePrincipal.codigo_referencia}`}>
                    <h3 className="home-featured-title">{destaquePrincipal.titulo}</h3>
                  </Link>
                  <div className="home-featured-loc">
                    <MapPin size={15} />
                    {destaquePrincipal.bairro}, {destaquePrincipal.cidade} - {destaquePrincipal.estado}
                  </div>

                  <div className="home-featured-specs">
                    {destaquePrincipal.area_total && (
                      <span><Maximize2 size={14} /> {formatArea(destaquePrincipal.area_total)}</span>
                    )}
                    {destaquePrincipal.quartos > 0 && (
                      <span><BedDouble size={14} /> {destaquePrincipal.quartos} quarto(s)</span>
                    )}
                    {destaquePrincipal.vagas_garagem > 0 && (
                      <span><Car size={14} /> {destaquePrincipal.vagas_garagem} vaga(s)</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="tabular-nums">
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                      {destaquePrincipal.preco_venda ? 'Valor de Venda' : 'Valor de Locação'}
                    </span>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                      {destaquePrincipal.preco_venda
                        ? formatCurrency(destaquePrincipal.preco_venda)
                        : `${formatCurrency(destaquePrincipal.preco_locacao)}/mês`}
                    </strong>
                  </div>

                  <Link to={`/imoveis/${destaquePrincipal.codigo_referencia}`} className="btn btn-primary">
                    Conhecer imóvel
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </article>

            {/* Demais Imóveis em Grade */}
            {demaisDestaques.length > 0 && (
              <div className="home-properties-grid">
                {demaisDestaques.map((imovel) => (
                  <PropertyCard key={imovel.id} imovel={imovel} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* SPLIT ARQUITETÔNICO: COMPRA E LOCAÇÃO */}
      <section className="home-split-paths">
        <div className="home-path-card home-path-buy">
          <span className="home-path-number" aria-hidden="true">01</span>
          <div>
            <h3>Compra de Imóveis</h3>
            <p>
              Apartamentos, casas, coberturas e salas comerciais com documentação verificada para moradia ou investimento.
            </p>
          </div>
          <Link to="/imoveis?finalidade=VENDA" className="btn btn-sand" style={{ width: 'fit-content' }}>
            Ver imóveis à venda
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="home-path-card home-path-rent">
          <span className="home-path-number" aria-hidden="true">02</span>
          <div>
            <h3>Locação Residencial e Comercial</h3>
            <p>
              Opções prontas para ocupação com processo transparente e acompanhamento dedicado da nossa equipe.
            </p>
          </div>
          <Link to="/imoveis?finalidade=LOCACAO" className="btn btn-primary" style={{ width: 'fit-content' }}>
            Ver imóveis para alugar
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SEÇÃO INSTITUCIONAL ASSIMÉTRICA */}
      <section className="home-about-band">
        <div className="home-about-grid">
          <div className="home-about-crest">
            <img src={logoVistaLivre} alt="Brasão Vista Livre Imóveis" />
            <span>Vista Livre</span>
          </div>

          <div className="home-about-content">
            <div className="home-section-kicker">Institucional</div>
            <h2>Segurança e clareza em cada negociação</h2>
            <p>
              A Vista Livre Negócios Imobiliários LTDA atua com foco na análise criteriosa de cada imóvel anunciado,
              garantindo que proprietários, compradores e locatários tenham suporte técnico e atendimento próximo do início ao fechamento.
            </p>

            <div className="home-about-pillars">
              <span className="home-about-pillar"><ShieldCheck size={17} /> Análise documental</span>
              <span className="home-about-pillar"><ShieldCheck size={17} /> Catálogo atualizado</span>
              <span className="home-about-pillar"><ShieldCheck size={17} /> Atendimento personalizado</span>
            </div>

            <div className="home-about-actions">
              <Link to="/sobre" className="btn btn-primary">Sobre a Vista Livre</Link>
              <Link to="/contato" className="btn btn-secondary">Falar com a equipe</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}