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
    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Barra Lateral */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1rem',
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
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={logoVistaLivre}
                alt="Vista Livre Imóveis"
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                  VISTA LIVRE
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Painel Administrativo
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="mobile-only-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            <ExternalLink size={15} />
            Ver Site Público
          </a>

          <div style={{ padding: '0.5rem 0.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{usuario?.nome}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {usuario?.perfil === 'ADMIN' ? 'Administrador' : 'Corretor'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', color: 'var(--color-danger-text)' }}
          >
            <LogOut size={16} />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column' }} className="admin-main-wrapper">
        <header
          style={{
            height: '60px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            className="mobile-only-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Vista Livre Negócios Imobiliários LTDA
          </span>
        </header>

        <main style={{ padding: '1.75rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
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