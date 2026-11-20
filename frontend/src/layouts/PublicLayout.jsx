import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Lock, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { EMPRESA_CONFIG } from '../config/empresa';
import logoVistaLivre from '../assets/vistalivre_logo.png';

export function PublicLayout() {
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 700 : 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
    padding: '0.4rem 0.25rem',
    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
    fontSize: '0.95rem',
  });

  return (
    <div className="public-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Faixa Superior Institucional */}
      <div style={{ backgroundColor: 'var(--color-primary-dark)', color: '#E2E8F0', fontSize: '0.8rem' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.45rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={13} color="var(--color-accent-sand)" /> {EMPRESA_CONFIG.whatsappExibicao}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={13} color="var(--color-accent-sand)" /> {EMPRESA_CONFIG.emailContato}
            </span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-accent-sand)' }}>
            <Clock size={13} /> {EMPRESA_CONFIG.horarioAtendimento}
          </span>
        </div>
      </div>

      {/* Cabeçalho Principal */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={logoVistaLivre}
              alt="Logomarca Vista Livre Imóveis"
              style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.03em',
                }}
              >
                VISTA LIVRE
              </div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.16em', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                IMÓVEIS
              </div>
            </div>
          </Link>

          <nav className="public-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <NavLink to="/" end style={navLinkStyle}>Início</NavLink>
            <NavLink to="/imoveis" style={navLinkStyle}>Imóveis</NavLink>
            <NavLink to="/sobre" style={navLinkStyle}>Sobre</NavLink>
            <NavLink to="/contato" style={navLinkStyle}>Contato</NavLink>

            <Link to="/admin/login" className="btn btn-primary btn-sm" style={{ marginLeft: '0.5rem' }}>
              <Lock size={14} />
              Área Administrativa
            </Link>
          </nav>

          <button
            type="button"
            className="public-nav-mobile-btn"
            onClick={() => setMenuMobileAberto((prev) => !prev)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
            aria-label="Abrir menu de navegação"
          >
            {menuMobileAberto ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {menuMobileAberto && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--color-border)',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <Link to="/" onClick={() => setMenuMobileAberto(false)}>Início</Link>
            <Link to="/imoveis" onClick={() => setMenuMobileAberto(false)}>Imóveis</Link>
            <Link to="/sobre" onClick={() => setMenuMobileAberto(false)}>Sobre</Link>
            <Link to="/contato" onClick={() => setMenuMobileAberto(false)}>Contato</Link>
            <Link
              to="/admin/login"
              className="btn btn-primary btn-sm"
              style={{ width: 'fit-content' }}
              onClick={() => setMenuMobileAberto(false)}
            >
              <Lock size={14} />
              Área Administrativa
            </Link>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Rodapé Institucional */}
      <footer style={{ backgroundColor: 'var(--color-primary-dark)', color: '#FFFFFF', marginTop: '4rem' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '3rem 1.25rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <img
                src={logoVistaLivre}
                alt="Vista Livre Imóveis"
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem' }}>
                  VISTA LIVRE
                </div>
                <div style={{ fontSize: '0.74rem', letterSpacing: '0.16em', color: 'var(--color-accent-sand)' }}>
                  IMÓVEIS
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.6 }}>
              {EMPRESA_CONFIG.razaoSocial}. Transparência, segurança e atendimento dedicado na compra e locação de imóveis.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-accent-sand)', fontSize: '0.95rem', marginBottom: '0.9rem' }}>
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem', color: '#E2E8F0' }}>
              <li><Link to="/">Página Inicial</Link></li>
              <li><Link to="/imoveis">Catálogo de Imóveis</Link></li>
              <li><Link to="/imoveis?finalidade=VENDA">Imóveis à Venda</Link></li>
              <li><Link to="/imoveis?finalidade=LOCACAO">Imóveis para Locação</Link></li>
              <li><Link to="/sobre">Sobre a Empresa</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-accent-sand)', fontSize: '0.95rem', marginBottom: '0.9rem' }}>
              Atendimento
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#E2E8F0' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} /> {EMPRESA_CONFIG.telefoneExibicao} / {EMPRESA_CONFIG.whatsappExibicao}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} /> {EMPRESA_CONFIG.emailContato}
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span>{EMPRESA_CONFIG.endereco}</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '1.25rem',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: '#94A3B8',
          }}
        >
          <span>© {new Date().getFullYear()} {EMPRESA_CONFIG.razaoSocial}. Todos os direitos reservados.</span>
          <Link to="/admin/login" style={{ color: 'var(--color-accent-sand)', fontWeight: 500 }}>
            Acesso Restrito (Funcionários)
          </Link>
        </div>
      </footer>

      <style>{`
        .public-nav-mobile-btn { display: none; }
        @media (max-width: 820px) {
          .public-nav-desktop { display: none !important; }
          .public-nav-mobile-btn { display: inline-flex; }
        }
      `}</style>
    </div>
  );
}