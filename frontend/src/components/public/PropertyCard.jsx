import { Link } from 'react-router-dom';
import { BedDouble, Bath, Car, Maximize2, MapPin, ImageOff, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatArea } from '../../utils/formatters';

export function PropertyCard({ imovel }) {
  return (
    <article className="vl-property-card">
      <Link to={`/imoveis/${imovel.codigo_referencia}`} className="vl-property-media">
        {imovel.foto_principal ? (
          <img
            src={imovel.foto_principal}
            alt={imovel.titulo}
            className="vl-property-img"
          />
        ) : (
          <div className="vl-property-empty-media">
            <div>
              <ImageOff size={26} />
              <div>Sem fotografia</div>
            </div>
          </div>
        )}

        <span className="vl-property-badge-finalidade">{imovel.finalidade_nome}</span>

        <span className="vl-property-location-overlay">
          <MapPin size={13} />
          {imovel.bairro}, {imovel.cidade}
        </span>

        <span className="vl-property-code">{imovel.codigo_referencia}</span>
      </Link>

      <div className="vl-property-body">
        <div>
          <div className="vl-property-type">{imovel.tipo_nome}</div>
          <Link to={`/imoveis/${imovel.codigo_referencia}`}>
            <h3 className="vl-property-title">{imovel.titulo}</h3>
          </Link>
        </div>

        <div>
          <div className="vl-property-specs">
            {imovel.area_total && (
              <span className="vl-property-spec-pill">
                <Maximize2 size={13} /> {formatArea(imovel.area_total)}
              </span>
            )}
            {imovel.quartos > 0 && (
              <span className="vl-property-spec-pill">
                <BedDouble size={13} /> {imovel.quartos} quarto(s)
              </span>
            )}
            {imovel.banheiros > 0 && (
              <span className="vl-property-spec-pill">
                <Bath size={13} /> {imovel.banheiros} banh.
              </span>
            )}
            {imovel.vagas_garagem > 0 && (
              <span className="vl-property-spec-pill">
                <Car size={13} /> {imovel.vagas_garagem} vaga(s)
              </span>
            )}
          </div>

          <div className="vl-property-footer">
            <div className="tabular-nums">
              {imovel.preco_venda && (
                <div>
                  <span className="vl-property-price-label">Venda</span>
                  <strong className="vl-property-price-value">
                    {formatCurrency(imovel.preco_venda)}
                  </strong>
                </div>
              )}
              {imovel.preco_locacao && (
                <div>
                  <span className="vl-property-price-label">Locação</span>
                  <strong className="vl-property-price-value">
                    {formatCurrency(imovel.preco_locacao)}/mês
                  </strong>
                </div>
              )}
            </div>

            <Link to={`/imoveis/${imovel.codigo_referencia}`} className="vl-property-cta">
              Ver imóvel
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}