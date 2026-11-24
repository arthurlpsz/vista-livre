import { Link } from 'react-router-dom';
import { EMPRESA_CONFIG } from '../../config/empresa';

export function SobrePage() {
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Sobre a {EMPRESA_CONFIG.nomeFantasia}
      </h1>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', lineHeight: 1.75 }}>
        <p>
          A <strong>{EMPRESA_CONFIG.razaoSocial}</strong> atua no mercado imobiliário oferecendo assessoria completa
          para clientes que buscam adquirir, vender ou alugar imóveis residenciais e comerciais.
        </p>
        <p>
          Nosso compromisso é conduzir cada negociação com clareza, análise documental rigorosa e acompanhamento
          próximo em todas as etapas, garantindo tranquilidade tanto para proprietários quanto para compradores e locatários.
        </p>

        <div style={{ paddingTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/imoveis" className="btn btn-primary">Ver Imóveis Disponíveis</Link>
          <Link to="/contato" className="btn btn-secondary">Entrar em Contato</Link>
        </div>
      </div>
    </div>
  );
}