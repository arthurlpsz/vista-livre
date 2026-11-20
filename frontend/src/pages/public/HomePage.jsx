import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Building2, KeyRound, ShieldCheck, FileCheck2, Handshake } from 'lucide-react';
import { api } from '../../services/api';
import { PropertyCard } from '../../components/public/PropertyCard';

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
          api.get('/public/imoveis', { params: { destaque: 'true', limit: 6 } }),
          api.get('/public/filtros'),
        ]);

        if (destaquesRes.data.itens.length > 0) {
          setDestaques(destaquesRes.data.itens);
        } else {
          const recentesRes = await api.get('/public/imoveis', { params: { limit: 6 } });
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

  return (
    <div>
      {/* Hero Institucional com Gradiente da Marca */}
      <section
        style={{
          background: 'linear-gradient(135deg, #092859 0%, #0E3C82 60%, #164C9E 100%)',
          color: '#FFFFFF',
          padding: '4.5rem 1.25rem 5.25rem',
          borderBottom: '4px solid var(--color-accent-sand)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(235, 224, 186, 0.16)',
              border: '1px solid rgba(235, 224, 186, 0.35)',
              color: 'var(--color-accent-sand)',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1.1rem',
            }}
          >
            Vista Livre Negócios Imobiliários
          </span>

          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
              lineHeight: 1.2,
              maxWidth: '780px',
              margin: '0 auto 1rem',
            }}
          >
            Encontre o imóvel ideal para morar ou investir com segurança
          </h1>

          <p
            style={{
              color: '#DCE6F7',
              fontSize: '1.05rem',
              maxWidth: '640px',
              margin: '0 auto 2.25rem',
            }}
          >
            Explore nosso catálogo atualizado de imóveis disponíveis para compra e locação com atendimento próximo e transparente.
          </p>

          {/* Barra de Busca Rápida */}
          <form
            onSubmit={handleBuscaRapida}
            className="card"
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              padding: '1.15rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '0.85rem',
              textAlign: 'left',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Finalidade</label>
              <select className="form-control" value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                <option value="">Comprar ou Alugar</option>
                <option value="VENDA">Comprar</option>
                <option value="LOCACAO">Alugar</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Tipo de Imóvel</label>
              <select className="form-control" value={tipoImovelId} onChange={(e) => setTipoImovelId(e.target.value)}>
                <option value="">Todos os tipos</option>
                {opcoesFiltro.tipos_imovel.map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Cidade, Bairro ou Código</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Boqueirão, VL-1001..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
                <Search size={17} />
                Buscar Imóveis
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Faixa de Pilares Institucionais */}
      <section style={{ backgroundColor: 'var(--color-surface-sand)', borderBottom: '1px solid var(--color-surface-sand-dark)' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1.5rem 1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem' }}>
              <strong>Segurança Jurídica</strong>
              <div style={{ color: 'var(--color-text-secondary)' }}>Análise documental rigorosa</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileCheck2 size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem' }}>
              <strong>Catálogo Atualizado</strong>
              <div style={{ color: 'var(--color-text-secondary)' }}>Disponibilidade verificada pela equipe</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Handshake size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem' }}>
              <strong>Atendimento Direto</strong>
              <div style={{ color: 'var(--color-text-secondary)' }}>Suporte em cada etapa da negociação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Imóveis Selecionados */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.75rem 1.25rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--color-primary)' }}>Imóveis em Destaque</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Oportunidades selecionadas pela equipe da Vista Livre
            </p>
          </div>

          <Link to="/imoveis" className="btn btn-primary">
            Ver catálogo completo
            <ArrowRight size={16} />
          </Link>
        </div>

        {carregando ? (
          <div style={{ padding: '3rem 0' }}><div className="spinner" /></div>
        ) : destaques.length === 0 ? (
          <div className="card empty-state">
            <p style={{ marginBottom: '1rem' }}>Nenhum imóvel publicado no catálogo até o momento.</p>
            <Link to="/imoveis" className="btn btn-primary btn-sm">Ir para o Catálogo</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {destaques.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </section>

      {/* Chamadas por Finalidade */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              borderTop: '4px solid var(--color-primary)',
            }}
          >
            <div>
              <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                <Building2 size={30} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Imóveis para Compra</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem' }}>
                Apartamentos, casas, coberturas e imóveis comerciais prontos para morar ou investir.
              </p>
            </div>
            <Link to="/imoveis?finalidade=VENDA" className="btn btn-primary" style={{ width: 'fit-content' }}>
              Explorar imóveis à venda
            </Link>
          </div>

          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              borderTop: '4px solid var(--color-primary-dark)',
            }}
          >
            <div>
              <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                <KeyRound size={30} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Imóveis para Locação</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem' }}>
                Opções residenciais e comerciais com processos claros e suporte durante toda a locação.
              </p>
            </div>
            <Link to="/imoveis?finalidade=LOCACAO" className="btn btn-primary" style={{ width: 'fit-content' }}>
              Explorar imóveis para alugar
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Institucional */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-sand)',
          borderTop: '1px solid var(--color-surface-sand-dark)',
          borderBottom: '1px solid var(--color-surface-sand-dark)',
          marginTop: '3rem',
          padding: '4rem 1.25rem',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <ShieldCheck size={36} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
          <h2 style={{ fontSize: '1.65rem', color: 'var(--color-primary)', marginBottom: '0.85rem' }}>
            Sobre a Vista Livre Negócios Imobiliários
          </h2>
          <p style={{ color: 'var(--color-text-primary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '760px', margin: '0 auto 1.75rem' }}>
            Atuamos na intermediação de compra, venda e locação de imóveis com foco em transparência documental,
            avaliação criteriosa e atendimento personalizado para cada cliente.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/sobre" className="btn btn-primary">Conheça nossa história</Link>
            <Link to="/contato" className="btn btn-secondary">Fale com nossa equipe</Link>
          </div>
        </div>
      </section>
    </div>
  );
}