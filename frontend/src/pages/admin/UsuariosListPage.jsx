import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { extrairMensagemErro } from '../../utils/formatters';
import { AlertMessage } from '../../components/common/AlertMessage';

export function UsuariosListPage() {
  const { usuario: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('CORRETOR');
  const [criando, setCriando] = useState(false);

  async function carregarUsuarios() {
    try {
      const { data } = await api.get('/admin/usuarios');
      setUsuarios(data.usuarios);
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao carregar funcionários.') });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function handleCriar(e) {
    e.preventDefault();
    setCriando(true);
    setFeedback({ tipo: '', mensagem: '' });

    try {
      await api.post('/admin/usuarios', { nome, email, senha, perfil });
      setNome('');
      setEmail('');
      setSenha('');
      setPerfil('CORRETOR');
      setFeedback({ tipo: 'success', mensagem: 'Conta de funcionário criada com sucesso.' });
      carregarUsuarios();
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao cadastrar funcionário.') });
    } finally {
      setCriando(false);
    }
  }

  async function handleAlternarStatus(alvo) {
    try {
      await api.put(`/admin/usuarios/${alvo.id}`, {
        nome: alvo.nome,
        email: alvo.email,
        perfil: alvo.perfil,
        ativo: !alvo.ativo,
      });
      setFeedback({
        tipo: 'success',
        mensagem: `Acesso de ${alvo.nome} ${!alvo.ativo ? 'ativado' : 'desativado'}.`,
      });
      carregarUsuarios();
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao alterar status do funcionário.') });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Funcionários Autorizados</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Gerencie as contas individuais de acesso ao painel administrativo
        </p>
      </div>

      <AlertMessage tipo={feedback.tipo} mensagem={feedback.mensagem} />

      {/* Formulário de Novo Funcionário */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>Cadastrar Novo Acesso</h2>
        <form onSubmit={handleCriar} className="form-grid" style={{ alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Senha Inicial (mín. 8 caracteres)</label>
            <input type="password" className="form-control" minLength={8} value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Perfil</label>
            <select className="form-control" value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              <option value="CORRETOR">Corretor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={criando}>
            <UserPlus size={16} />
            {criando ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Lista de Funcionários */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {carregando ? (
          <div style={{ padding: '3rem 0' }}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.nome}</td>
                    <td>{u.email}</td>
                    <td>{u.perfil === 'ADMIN' ? 'Administrador' : 'Corretor'}</td>
                    <td>
                      <span className={`badge ${u.ativo ? 'badge-disponivel' : 'badge-vendido'}`}>
                        {u.ativo ? 'Ativo' : 'Desativado'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.id !== usuarioLogado?.id && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleAlternarStatus(u)}
                        >
                          {u.ativo ? 'Desativar' : 'Reativar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}