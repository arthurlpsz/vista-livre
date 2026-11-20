import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoVistaLivre from '../assets/vistalivre_logo.png';

export function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.92rem',
    backgroundColor: isActive ? 'rgba(235, 224, 186, 0.16)' : 'transparent',
    color: isActive ? 'var(--color-accent-sand)' : '#E2E8F0',
    borderLeft: isActive ? '3px solid var(--color-accent-sand)' : '3px solid transparent',
    transition: 'background-color 0.15s ease',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-app)' }}>
      {/* Barra Lateral Institucional */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-primary-dark)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.35rem 1rem',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: menuAberto ? 0 : undefined,
          zIndex: 50,
        }}
        className={`admin-sidebar ${menuAberto ? 'open' : ''}`}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={logoVistaLivre}
                alt="Vista Livre Imóveis"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(235, 224, 186, 0.45)',
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    color: '#FFFFFF',
                    letterSpacing: '0.03em',
                  }}
                >
                  VISTA LIVRE
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-accent-sand)' }}>
                  Painel Administrativo
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="mobile-only-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF' }}
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <NavLink to="/admin" end style={linkStyle} onClick={() => setMenuAberto(false)}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/imoveis" style={linkStyle} onClick={() => setMenuAberto(false)}>
              <Building2 size={18} />
              Imóveis
            </NavLink>

            {usuario?.perfil === 'ADMIN' && (
              <NavLink to="/admin/usuarios" style={linkStyle} onClick={() => setMenuAberto(false)}>
                <Users size={18} />
                Funcionários
              </NavLink>
            )}
          </nav>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm"
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.18)',
            }}
          >
            <ExternalLink size={15} />
            Ver Site Público
          </a>

          <div
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{usuario?.nome}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-sand)' }}>
              {usuario?.perfil === 'ADMIN' ? 'Administrador' : 'Corretor'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-sm"
            style={{
              width: '100%',
              backgroundColor: 'rgba(220, 38, 38, 0.18)',
              color: '#FCA5A5',
              borderColor: 'rgba(248, 113, 113, 0.3)',
            }}
          >
            <LogOut size={16} />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div
        style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column' }}
        className="admin-main-wrapper"
      >
        <header
          style={{
            height: '62px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
          }}
        >
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            className="mobile-only-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Vista Livre Negócios Imobiliários LTDA — Gestão Interna
          </span>
        </header>

        <main style={{ padding: '1.85rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .mobile-only-btn { display: none; }
        @media (max-width: 900px) {
          .mobile-only-btn { display: inline-flex; }
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.2s ease; }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main-wrapper { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}