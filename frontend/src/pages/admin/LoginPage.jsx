import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertMessage } from '../../components/common/AlertMessage';
import { extrairMensagemErro } from '../../utils/formatters';
import logoVistaLivre from '../../assets/vistalivre_logo.png';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, senha);
      navigate('/admin', { replace: true });
    } catch (error) {
      setErro(extrairMensagemErro(error, 'Não foi possível realizar o login.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-split-wrapper">
      {/* Coluna Esquerda: Identidade Visual e Institucional */}
      <aside className="login-brand-panel">
        {/* Elemento decorativo sutil inspirado nas ondas da marca */}
        <svg
          className="login-wave-bg"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="680" cy="120" r="320" stroke="#EBE0BA" strokeOpacity="0.08" strokeWidth="1.5" />
          <circle cx="680" cy="120" r="220" stroke="#EBE0BA" strokeOpacity="0.06" strokeWidth="1.5" />
          <path
            d="M-80 650C120 590 280 720 480 660C640 612 740 650 880 620"
            stroke="#EBE0BA"
            strokeOpacity="0.12"
            strokeWidth="2"
          />
          <path
            d="M-80 695C140 635 300 765 500 705C660 657 760 695 900 665"
            stroke="#EBE0BA"
            strokeOpacity="0.07"
            strokeWidth="2"
          />
        </svg>

        <div className="login-brand-top">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={16} />
            Voltar à página inicial
          </Link>
        </div>

        <div className="login-brand-center">
          <div className="login-logo-ring">
            <img
              src={logoVistaLivre}
              alt="Logomarca oficial Vista Livre Imóveis"
              className="login-logo-img"
            />
          </div>

          <span className="login-brand-kicker">PLATAFORMA DE GESTÃO IMOBILIÁRIA</span>
          <h2 className="login-brand-title">Vista Livre Negócios Imobiliários</h2>
          <p className="login-brand-subtitle">
            Ambiente interno integrado para publicação de imóveis, controle de disponibilidade e gestão do catálogo digital.
          </p>

          <div className="login-pillars">
            <div className="login-pillar-item">
              <Building2 size={18} color="#EBE0BA" />
              <span>Sincronização imediata com o catálogo público</span>
            </div>
            <div className="login-pillar-item">
              <CheckCircle2 size={18} color="#EBE0BA" />
              <span>Controle de status: disponível, vendido e alugado</span>
            </div>
            <div className="login-pillar-item">
              <ShieldCheck size={18} color="#EBE0BA" />
              <span>Acesso autenticado com rastreabilidade por usuário</span>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          <span>© {new Date().getFullYear()} Vista Livre Negócios Imobiliários LTDA</span>
        </div>
      </aside>

      {/* Coluna Direita: Formulário de Acesso */}
      <main className="login-form-panel">
        <div className="login-form-box">
          {/* Cabeçalho compacto exibido apenas em telas menores */}
          <div className="login-mobile-header">
            <img
              src={logoVistaLivre}
              alt="Vista Livre Imóveis"
              style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <Link to="/" style={{ fontSize: '0.84rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              ← Voltar ao site
            </Link>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)',
                padding: '0.32rem 0.75rem',
                borderRadius: '999px',
                marginBottom: '0.85rem',
              }}
            >
              <ShieldCheck size={14} />
              Área Restrita
            </span>

            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              Acesso Administrativo
            </h1>
            <p style={{ fontSize: '0.93rem', color: 'var(--color-text-secondary)', marginTop: '0.45rem' }}>
              Informe suas credenciais corporativas para gerenciar o catálogo da imobiliária.
            </p>
          </div>

          <AlertMessage tipo="error" mensagem={erro} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                E-mail corporativo
              </label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-control login-input"
                  placeholder="seu.nome@vistalivre.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="senha">
                Senha de acesso
              </label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  className="form-control login-input"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  style={{ paddingRight: '2.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="login-eye-btn"
                  aria-label="Alternar visibilidade da senha"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary login-submit-btn"
              disabled={carregando}
            >
              <Lock size={17} />
              {carregando ? 'Verificando credenciais...' : 'Entrar no Painel'}
            </button>
          </form>

          <div className="login-security-note">
            Uso exclusivo para funcionários autorizados da Vista Livre. Todas as alterações realizadas no painel são registradas.
          </div>
        </div>
      </main>

      <style>{`
        .login-split-wrapper {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          background-color: var(--color-bg-public);
        }

        .login-brand-panel {
          position: relative;
          overflow: hidden;
          background: linear-gradient(155deg, #071E44 0%, #092859 48%, #0E3C82 100%);
          color: #FFFFFF;
          padding: 2.5rem 3.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 4px solid var(--color-accent-sand);
        }

        .login-wave-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .login-brand-top,
        .login-brand-center,
        .login-brand-footer {
          position: relative;
          z-index: 1;
        }

        .login-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-accent-sand);
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          background-color: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(235, 224, 186, 0.22);
          transition: background-color 0.18s ease;
        }

        .login-back-link:hover {
          background-color: rgba(255, 255, 255, 0.14);
        }

        .login-brand-center {
          max-width: 470px;
          margin: auto 0;
          padding: 2rem 0;
        }

        .login-logo-ring {
          width: 138px;
          height: 138px;
          border-radius: 50%;
          padding: 5px;
          background: linear-gradient(145deg, rgba(235, 224, 186, 0.55), rgba(235, 224, 186, 0.12));
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
          margin-bottom: 1.75rem;
        }

        .login-logo-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .login-brand-kicker {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--color-accent-sand);
          margin-bottom: 0.6rem;
        }

        .login-brand-title {
          color: #FFFFFF;
          font-size: 1.95rem;
          line-height: 1.22;
          margin-bottom: 0.85rem;
        }

        .login-brand-subtitle {
          color: #CBD5E1;
          font-size: 0.96rem;
          line-height: 1.65;
          margin-bottom: 2rem;
        }

        .login-pillars {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .login-pillar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: #E2E8F0;
        }

        .login-brand-footer {
          font-size: 0.8rem;
          color: #94A3B8;
        }

        .login-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          background-color: #FFFFFF;
        }

        .login-form-box {
          width: 100%;
          max-width: 410px;
        }

        .login-mobile-header {
          display: none;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 0.9rem;
          color: var(--color-text-secondary);
          pointer-events: none;
        }

        .login-input {
          padding-left: 2.65rem;
          height: 46px;
          font-size: 0.95rem;
          background-color: #F8FAFC;
        }

        .login-input:focus {
          background-color: #FFFFFF;
        }

        .login-eye-btn {
          position: absolute;
          right: 0.85rem;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          padding: 0.2rem;
        }

        .login-eye-btn:hover {
          color: var(--color-primary);
        }

        .login-submit-btn {
          width: 100%;
          height: 48px;
          margin-top: 0.35rem;
          font-size: 0.96rem;
          box-shadow: 0 4px 12px rgba(14, 60, 130, 0.22);
        }

        .login-security-note {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }

        @media (max-width: 920px) {
          .login-split-wrapper {
            grid-template-columns: 1fr;
            background-color: var(--color-bg-public);
          }

          .login-brand-panel {
            display: none;
          }

          .login-form-panel {
            background-color: var(--color-bg-public);
            padding: 1.5rem;
          }

          .login-form-box {
            background-color: #FFFFFF;
            padding: 2rem 1.75rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-md);
          }

          .login-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid var(--color-border);
          }
        }
      `}</style>
    </div>
  );
}