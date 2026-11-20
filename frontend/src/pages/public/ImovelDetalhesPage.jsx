import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Car,
  CheckCircle2,
  MessageCircle,
  ImageOff,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, formatArea } from '../../utils/formatters';
import { gerarLinkWhatsApp } from '../../config/empresa';

export function ImovelDetalhesPage() {
  const { codigo } = useParams();
  const [imovel, setImovel] = useState(null);
  const [fotoAtiva, setFotoAtiva] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    async function carregarImovel() {
      setCarregando(true);
      setNaoEncontrado(false);
      try {
        const { data } = await api.get(`/public/imoveis/${codigo}`);
        setImovel(data);
        setFotoAtiva(data.fotos?.[0]?.url || null);
      } catch {
        setNaoEncontrado(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarImovel();
  }, [codigo]);

  if (carregando) {
    return <div style={{ padding: '5rem 0' }}><div className="spinner" /></div>;
  }

  if (naoEncontrado || !imovel) {
    return (
      <div style={{ maxWidth: '720px', margin: '4rem auto', padding: '0 1.25rem' }}>
        <div className="card empty-state">
          <h2 style={{ marginBottom: '0.5rem' }}>Imóvel indisponível ou não encontrado</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Este anúncio pode ter sido negociado recentemente ou o código informado não existe.
          </p>
          <Link to="/imoveis" className="btn btn-primary">
            Voltar para o Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const mensagemWhatsApp = `Olá, equipe Vista Livre! Tenho interesse no imóvel "${imovel.titulo}" (Código: ${imovel.codigo_referencia}) anunciado no site.`;
  const linkWhatsApp = gerarLinkWhatsApp(mensagemWhatsApp);

  const enderecoFormatado = imovel.exibir_endereco_completo && imovel.logradouro
    ? `${imovel.logradouro}${imovel.numero ? `, ${imovel.numero}` : ''} — ${imovel.bairro}, ${imovel.cidade}/${imovel.estado}`
    : `${imovel.bairro}, ${imovel.cidade} - ${imovel.estado}`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem' }}>
      <Link to="/imoveis" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.25rem' }}>
        <ArrowLeft size={15} />
        Voltar ao catálogo
      </Link>

      {/* Cabeçalho do Imóvel */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span className="badge badge-disponivel">{imovel.situacao_nome}</span>
          <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            {imovel.tipo_nome} • {imovel.finalidade_nome}
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--color-neutral-bg)', color: 'var(--color-text-secondary)' }}>
            Cód. {imovel.codigo_referencia}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.45rem, 3vw, 2rem)', marginBottom: '0.4rem' }}>{imovel.titulo}</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)' }}>
          <MapPin size={16} />
          {enderecoFormatado}
        </p>
      </div>

      {/* Grid Principal: Galeria + Descrição à esquerda | Card de Preço e WhatsApp à direita */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '1.75rem', alignItems: 'start' }} className="detalhes-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Galeria de Fotografias */}
          <div className="card" style={{ padding: '0.85rem' }}>
            {fotoAtiva ? (
              <img
                src={fotoAtiva}
                alt={imovel.titulo}
                style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }}
              />
            ) : (
              <div style={{ height: '320px', backgroundColor: 'var(--color-neutral-bg)', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', color: 'var(--color-text-secondary)' }}>
                <div style={{ textAlign: 'center' }}>
                  <ImageOff size={32} />
                  <p style={{ marginTop: '0.5rem' }}>Fotografias em atualização</p>
                </div>
              </div>
            )}

            {imovel.fotos?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', marginTop: '0.75rem', paddingBottom: '0.25rem' }}>
                {imovel.fotos.map((foto) => (
                  <button
                    key={foto.id}
                    type="button"
                    onClick={() => setFotoAtiva(foto.url)}
                    style={{
                      padding: 0,
                      border: fotoAtiva === foto.url ? '2px solid var(--color-primary)' : '2px solid transparent',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={foto.url}
                      alt="Miniatura do imóvel"
                      style={{ width: '84px', height: '62px', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Características Físicas */}
          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Características do Imóvel</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '1rem' }}>
              {imovel.area_total && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Área Total</span>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Maximize2 size={16} color="var(--color-primary)" /> {formatArea(imovel.area_total)}
                  </div>
                </div>
              )}
              {imovel.area_construida && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Área Construída</span>
                  <div style={{ fontWeight: 700 }}>{formatArea(imovel.area_construida)}</div>
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Quartos</span>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BedDouble size={16} color="var(--color-primary)" /> {imovel.quartos} {imovel.suites > 0 ? `(${imovel.suites} suíte)` : ''}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Banheiros</span>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bath size={16} color="var(--color-primary)" /> {imovel.banheiros}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Vagas</span>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Car size={16} color="var(--color-primary)" /> {imovel.vagas_garagem}
                </div>
              </div>
            </div>
          </div>

          {/* Descrição e Diferenciais */}
          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Descrição</h2>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
              {imovel.descricao}
            </p>

            {imovel.diferenciais?.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Diferenciais e Comodidades</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                  {imovel.diferenciais.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem' }}>
                      <CheckCircle2 size={16} color="var(--color-success-text)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Lateral: Valores e Contato */}
        <aside className="card" style={{ position: 'sticky', top: '88px' }}>
          <div className="tabular-nums" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {imovel.preco_venda && (
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Valor de Venda</span>
                <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                  {formatCurrency(imovel.preco_venda)}
                </div>
              </div>
            )}

            {imovel.preco_locacao && (
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Valor de Locação</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                  {formatCurrency(imovel.preco_locacao)} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>/mês</span>
                </div>
              </div>
            )}

            {(imovel.valor_condominio || imovel.valor_iptu) && (
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {imovel.valor_condominio && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Condomínio:</span>
                    <strong>{formatCurrency(imovel.valor_condominio)}</strong>
                  </div>
                )}
                {imovel.valor_iptu && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>IPTU:</span>
                    <strong>{formatCurrency(imovel.valor_iptu)}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              width: '100%',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              padding: '0.85rem 1rem',
              fontSize: '0.96rem',
            }}
          >
            <MessageCircle size={19} />
            Falar pelo WhatsApp
          </a>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '0.75rem' }}>
            Atendimento direto com a equipe Vista Livre informando o código <strong>{imovel.codigo_referencia}</strong>.
          </p>
        </aside>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .detalhes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}