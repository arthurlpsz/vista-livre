import { Link } from 'react-router-dom';
import { BedDouble, Bath, Car, Maximize2, MapPin, ImageOff } from 'lucide-react';
import { formatCurrency, formatArea } from '../../utils/formatters';

export function PropertyCard({ imovel }) {
  return (
    <article
      className="card property-card"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <Link to={`/imoveis/${imovel.codigo_referencia}`} style={{ display: 'block', position: 'relative' }}>
        {imovel.foto_principal ? (
          <img
            src={imovel.foto_principal}
            alt={imovel.titulo}
            style={{ width: '100%', height: '215px', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '215px',
              backgroundColor: 'var(--color-neutral-bg)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--color-text-secondary)',
            }}
          >
            <div style={{ textAlign: 'center', fontSize: '0.82rem' }}>
              <ImageOff size={26} style={{ marginBottom: '0.35rem' }} />
              <div>Sem fotografia</div>
            </div>
          </div>
        )}

        <span
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '0.28rem 0.7rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {imovel.finalidade_nome}
        </span>

        <span
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            color: '#FFFFFF',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            fontSize: '0.74rem',
            fontWeight: 600,
          }}
        >
          {imovel.codigo_referencia}
        </span>
      </Link>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            {imovel.tipo_nome}
          </div>

          <Link to={`/imoveis/${imovel.codigo_referencia}`}>
            <h3 style={{ fontSize: '1.05rem', lineHeight: 1.35, marginBottom: '0.5rem' }}>
              {imovel.titulo}
            </h3>
          </Link>

          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            <MapPin size={15} style={{ flexShrink: 0 }} />
            <span>{imovel.bairro}, {imovel.cidade} - {imovel.estado}</span>
          </p>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              padding: '0.75rem 0',
              borderTop: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '0.82rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
            }}
          >
            {imovel.area_total && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Maximize2 size={14} /> {formatArea(imovel.area_total)}
              </span>
            )}
            {imovel.quartos > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <BedDouble size={14} /> {imovel.quartos} quarto(s)
              </span>
            )}
            {imovel.banheiros > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Bath size={14} /> {imovel.banheiros} banh.
              </span>
            )}
            {imovel.vagas_garagem > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Car size={14} /> {imovel.vagas_garagem} vaga(s)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div className="tabular-nums">
              {imovel.preco_venda && (
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', display: 'block' }}>Venda</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                    {formatCurrency(imovel.preco_venda)}
                  </strong>
                </div>
              )}
              {imovel.preco_locacao && (
                <div style={{ marginTop: imovel.preco_venda ? '0.25rem' : 0 }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', display: 'block' }}>Locação</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                    {formatCurrency(imovel.preco_locacao)}/mês
                  </strong>
                </div>
              )}
            </div>

            <Link to={`/imoveis/${imovel.codigo_referencia}`} className="btn btn-secondary btn-sm">
              Detalhes
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}