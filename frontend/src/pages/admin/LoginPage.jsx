import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-sand)',
        display: 'grid',
        placeItems: 'center',
        padding: '1.25rem',
      }}
    >
      <div className="card" style={{ maxWidth: '410px', width: '100%', padding: '2.25rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img
            src={logoVistaLivre}
            alt="Logomarca Vista Livre Imóveis"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <h1 style={{ fontSize: '1.3rem', color: 'var(--color-primary)' }}>Área Administrativa</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Acesso restrito aos funcionários da Vista Livre
          </p>
        </div>

        <AlertMessage tipo="error" mensagem={erro} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              E-mail corporativo
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="nome@vistalivre.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="senha">
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                className="form-control"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
                aria-label="Alternar visibilidade da senha"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando} style={{ marginTop: '0.4rem', width: '100%' }}>
            <Lock size={16} />
            {carregando ? 'Autenticando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}