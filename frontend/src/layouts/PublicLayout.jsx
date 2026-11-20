import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Lock, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { EMPRESA_CONFIG } from '../config/empresa';
import logoVistaLivre from '../assets/vistalivre_logo.png';

export function PublicLayout() {
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  return (
    <div className="public-shell">
      <div className="public-topbar">
        <div className="public-topbar-inner">
          <div className="public-topbar-contacts">
            <span className="public-topbar-item">
              <Phone size={13} /> {EMPRESA_CONFIG.whatsappExibicao}
            </span>
            <span className="public-topbar-item">
              <Mail size={13} /> {EMPRESA_CONFIG.emailContato}
            </span>
          </div>
          <span className="public-topbar-hours">
            <Clock size={13} /> {EMPRESA_CONFIG.horarioAtendimento}
          </span>
        </div>
      </div>

      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="public-brand">
            <img
              src={logoVistaLivre}
              alt="Logomarca Vista Livre Imóveis"
              className="public-brand-logo"
            />
            <div>
              <div className="public-brand-name">VISTA LIVRE</div>
              <div className="public-brand-sub">IMÓVEIS</div>
            </div>
          </Link>

          <nav className="public-nav-desktop">
            <NavLink to="/" end className="public-nav-link">Início</NavLink>
            <NavLink to="/imoveis" className="public-nav-link">Imóveis</NavLink>
            <NavLink to="/sobre" className="public-nav-link">Sobre</NavLink>
            <NavLink to="/contato" className="public-nav-link">Contato</NavLink>

            <Link to="/admin/login" className="btn btn-primary btn-sm public-admin-btn">
              <Lock size={14} />
              Área Administrativa
            </Link>
          </nav>

          <button
            type="button"
            className="public-nav-mobile-btn"
            onClick={() => setMenuMobileAberto((prev) => !prev)}
            aria-label="Abrir menu de navegação"
          >
            {menuMobileAberto ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {menuMobileAberto && (
          <div className="public-mobile-drawer">
            <Link to="/" onClick={() => setMenuMobileAberto(false)}>Início</Link>
            <Link to="/imoveis" onClick={() => setMenuMobileAberto(false)}>Imóveis</Link>
            <Link to="/sobre" onClick={() => setMenuMobileAberto(false)}>Sobre</Link>
            <Link to="/contato" onClick={() => setMenuMobileAberto(false)}>Contato</Link>
            <Link
              to="/admin/login"
              className="btn btn-primary btn-sm"
              onClick={() => setMenuMobileAberto(false)}
            >
              <Lock size={14} />
              Área Administrativa
            </Link>
          </div>
        )}
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-grid">
          <div>
            <div className="public-footer-brand">
              <img
                src={logoVistaLivre}
                alt="Vista Livre Imóveis"
                className="public-footer-logo"
              />
              <div>
                <div className="public-brand-name" style={{ color: '#FFFFFF' }}>VISTA LIVRE</div>
                <div className="public-brand-sub" style={{ color: 'var(--color-accent-sand)' }}>IMÓVEIS</div>
              </div>
            </div>
            <p className="public-footer-desc">
              {EMPRESA_CONFIG.razaoSocial}. Assessoria imobiliária com transparência documental e atendimento dedicado para compra e locação.
            </p>
          </div>

          <div>
            <h4 className="public-footer-heading">Navegação</h4>
            <ul className="public-footer-list">
              <li><Link to="/">Página Inicial</Link></li>
              <li><Link to="/imoveis">Catálogo Completo</Link></li>
              <li><Link to="/imoveis?finalidade=VENDA">Imóveis à Venda</Link></li>
              <li><Link to="/imoveis?finalidade=LOCACAO">Imóveis para Locação</Link></li>
              <li><Link to="/sobre">Sobre a Empresa</Link></li>
              <li><Link to="/contato">Canais de Atendimento</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="public-footer-heading">Atendimento</h4>
            <ul className="public-footer-list">
              <li className="public-footer-contact-item">
                <Phone size={15} />
                <span>{EMPRESA_CONFIG.telefoneExibicao} / {EMPRESA_CONFIG.whatsappExibicao}</span>
              </li>
              <li className="public-footer-contact-item">
                <Mail size={15} />
                <span>{EMPRESA_CONFIG.emailContato}</span>
              </li>
              <li className="public-footer-contact-item">
                <MapPin size={15} />
                <span>{EMPRESA_CONFIG.endereco}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="public-footer-bottom">
          <span>© {new Date().getFullYear()} {EMPRESA_CONFIG.razaoSocial}. Todos os direitos reservados.</span>
          <Link to="/admin/login" className="public-footer-admin-link">
            Acesso Restrito (Funcionários)
          </Link>
        </div>
      </footer>
    </div>
  );
}