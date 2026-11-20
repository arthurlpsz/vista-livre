import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Building2, CheckCircle2, KeyRound, BadgeCheck, Pencil } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, extrairMensagemErro } from '../../utils/formatters';
import { AlertMessage } from '../../components/common/AlertMessage';

export function DashboardPage() {
  const location = useLocation();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagemSucesso] = useState(location.state?.mensagemSucesso || '');

  useEffect(() => {
    if (location.state?.mensagemSucesso) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const { data } = await api.get('/admin/imoveis/dashboard');
        setDados(data);
      } catch (error) {
        setErro(extrairMensagemErro(error, 'Erro ao carregar resumo do dashboard.'));
      } finally {
        setCarregando(false);
      }
    }
    carregarDashboard();
  }, []);

  if (carregando) {
    return <div style={{ padding: '4rem 0' }}><div className="spinner" /></div>;
  }

  const metricas = dados?.metricas || { total: 0, disponiveis: 0, vendidos: 0, alugados: 0 };
  const recentes = dados?.recentes || [];

  const cards = [
    { titulo: 'Total de Imóveis', valor: metricas.total, icone: Building2, cor: 'var(--color-primary)' },
    { titulo: 'Disponíveis', valor: metricas.disponiveis, icone: CheckCircle2, cor: 'var(--color-success-text)' },
    { titulo: 'Alugados', valor: metricas.alugados, icone: KeyRound, cor: 'var(--color-info-text)' },
    { titulo: 'Vendidos', valor: metricas.vendidos, icone: BadgeCheck, cor: 'var(--color-neutral-text)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Visão geral do catálogo de imóveis da Vista Livre
          </p>
        </div>

        <Link to="/admin/imoveis/novo" className="btn btn-primary">
          <Plus size={18} />
          Novo Imóvel
        </Link>
      </div>

      <AlertMessage tipo="success" mensagem={mensagemSucesso} />
      <AlertMessage tipo="error" mensagem={erro} />

      {/* Cards de Indicadores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map((item) => {
          const Icone = item.icone;
          return (
            <div key={item.titulo} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  {item.titulo}
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.85rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>
                  {item.valor}
                </div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-app)', color: item.cor }}>
                <Icone size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Imóveis Recentemente Cadastrados */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Imóveis Recentemente Cadastrados</h2>
          <Link to="/admin/imoveis" style={{ fontSize: '0.88rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            Ver todos →
          </Link>
        </div>

        {recentes.length === 0 ? (
          <div className="empty-state">
            Nenhum imóvel cadastrado até o momento. Clique em <strong>Novo Imóvel</strong> para iniciar o catálogo.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Imóvel</th>
                  <th>Localização</th>
                  <th>Valor</th>
                  <th>Situação</th>
                  <th>Site</th>
                  <th style={{ textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((imovel) => (
                  <tr key={imovel.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{imovel.codigo_referencia}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{imovel.titulo}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {imovel.tipo_nome} • {imovel.finalidade_nome}
                      </div>
                    </td>
                    <td>{imovel.bairro}, {imovel.cidade}</td>
                    <td className="tabular-nums">
                      {imovel.preco_venda ? formatCurrency(imovel.preco_venda) : formatCurrency(imovel.preco_locacao)}
                    </td>
                    <td>
                      <span className={`badge badge-${imovel.situacao_codigo.toLowerCase()}`}>
                        {imovel.situacao_nome}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: imovel.publicado ? 'var(--color-success-text)' : 'var(--color-text-secondary)' }}>
                      {imovel.publicado ? 'Publicado' : 'Oculto'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/admin/imoveis/${imovel.id}/editar`} className="btn btn-secondary btn-sm">
                        <Pencil size={14} />
                        Editar
                      </Link>
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