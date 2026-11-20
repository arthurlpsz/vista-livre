import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Star, Trash2, Plus, X } from 'lucide-react';
import { api } from '../../services/api';
import {
  extrairMensagemErro,
  formatarMoedaInput,
  formatarNumeroParaInput,
  parseMoedaInput,
} from '../../utils/formatters';
import { AlertMessage } from '../../components/common/AlertMessage';
import { ConfirmModal } from '../../components/common/ConfirmModal';

const ESTADO_INICIAL = {
  titulo: '',
  descricao: '',
  tipo_imovel_id: '',
  finalidade_id: '',
  situacao_id: '',
  publicado: true,
  destaque: false,
  preco_venda: '',
  preco_locacao: '',
  valor_condominio: '',
  valor_iptu: '',
  cep: '',
  estado: 'SP',
  cidade: '',
  bairro: '',
  logradouro: '',
  numero: '',
  complemento: '',
  exibir_endereco_completo: false,
  area_total: '',
  area_construida: '',
  quartos: 0,
  suites: 0,
  banheiros: 0,
  vagas_garagem: 0,
  diferenciais: [],
};

const CAMPOS_MONETARIOS = ['preco_venda', 'preco_locacao', 'valor_condominio', 'valor_iptu'];

export function ImovelFormPage() {
  const { id } = useParams();
  const modoEdicao = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [dominios, setDominios] = useState({ tipos_imovel: [], finalidades: [], situacoes_imovel: [] });
  const [fotos, setFotos] = useState([]);
  const [arquivosNovos, setArquivosNovos] = useState([]); // Array de { file, previewUrl }
  const [novoDiferencial, setNovoDiferencial] = useState('');

  const [carregandoTela, setCarregandoTela] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [enviandoFotos, setEnviandoFotos] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [fotoParaRemover, setFotoParaRemover] = useState(null);

  useEffect(() => {
    async function inicializar() {
      try {
        const domRes = await api.get('/admin/imoveis/dominios');
        setDominios(domRes.data);

        if (modoEdicao) {
          const imovelRes = await api.get(`/admin/imoveis/${id}`);
          const im = imovelRes.data;
          setForm({
            titulo: im.titulo || '',
            descricao: im.descricao || '',
            tipo_imovel_id: im.tipo_imovel_id,
            finalidade_id: im.finalidade_id,
            situacao_id: im.situacao_id,
            publicado: im.publicado,
            destaque: im.destaque,
            preco_venda: formatarNumeroParaInput(im.preco_venda),
            preco_locacao: formatarNumeroParaInput(im.preco_locacao),
            valor_condominio: formatarNumeroParaInput(im.valor_condominio),
            valor_iptu: formatarNumeroParaInput(im.valor_iptu),
            cep: im.cep || '',
            estado: im.estado || 'SP',
            cidade: im.cidade || '',
            bairro: im.bairro || '',
            logradouro: im.logradouro || '',
            numero: im.numero || '',
            complemento: im.complemento || '',
            exibir_endereco_completo: im.exibir_endereco_completo,
            area_total: im.area_total ?? '',
            area_construida: im.area_construida ?? '',
            quartos: im.quartos ?? 0,
            suites: im.suites ?? 0,
            banheiros: im.banheiros ?? 0,
            vagas_garagem: im.vagas_garagem ?? 0,
            diferenciais: Array.isArray(im.diferenciais) ? im.diferenciais : [],
          });
          setFotos(im.fotos || []);
        } else {
          const situacaoDisponivel = domRes.data.situacoes_imovel.find((s) => s.codigo === 'DISPONIVEL');
          setForm((prev) => ({
            ...prev,
            tipo_imovel_id: domRes.data.tipos_imovel[0]?.id || '',
            finalidade_id: domRes.data.finalidades[0]?.id || '',
            situacao_id: situacaoDisponivel?.id || '',
          }));
        }
      } catch (error) {
        setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao carregar dados do imóvel.') });
      } finally {
        setCarregandoTela(false);
      }
    }

    inicializar();
  }, [id, modoEdicao]);

  const finalidadeAtual = dominios.finalidades.find(
    (f) => Number(f.id) === Number(form.finalidade_id)
  )?.codigo;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (CAMPOS_MONETARIOS.includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: formatarMoedaInput(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleBuscarCep() {
    const cepLimpo = form.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          estado: data.uf || prev.estado,
          cidade: data.localidade || prev.cidade,
          bairro: data.bairro || prev.bairro,
          logradouro: data.logradouro || prev.logradouro,
        }));
      }
    } catch {
      // Falha silenciosa caso o serviço externo não responda
    }
  }

  function adicionarDiferencial() {
    const texto = novoDiferencial.trim();
    if (!texto || form.diferenciais.includes(texto)) return;
    setForm((prev) => ({ ...prev, diferenciais: [...prev.diferenciais, texto] }));
    setNovoDiferencial('');
  }

  function removerDiferencial(item) {
    setForm((prev) => ({
      ...prev,
      diferenciais: prev.diferenciais.filter((d) => d !== item),
    }));
  }

  function removerArquivoNovo(index) {
    setArquivosNovos((prev) => {
      const alvo = prev[index];
      if (alvo?.previewUrl) URL.revokeObjectURL(alvo.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function enviarArquivosParaApi(imovelId, listaArquivos) {
    if (!listaArquivos || listaArquivos.length === 0) return;
    const formData = new FormData();
    Array.from(listaArquivos).forEach((arquivo) => {
      formData.append('fotos', arquivo);
    });

    const { data } = await api.post(`/admin/imoveis/${imovelId}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setFotos(data.fotos);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback({ tipo: '', mensagem: '' });
    setSalvando(true);

    try {
      const payload = {
        ...form,
        preco_venda: finalidadeAtual === 'LOCACAO' ? null : parseMoedaInput(form.preco_venda),
        preco_locacao: finalidadeAtual === 'VENDA' ? null : parseMoedaInput(form.preco_locacao),
        valor_condominio: parseMoedaInput(form.valor_condominio),
        valor_iptu: parseMoedaInput(form.valor_iptu),
      };

      if (modoEdicao) {
        await api.put(`/admin/imoveis/${id}`, payload);
        setFeedback({ tipo: 'success', mensagem: 'Alterações do imóvel salvas com sucesso!' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const { data } = await api.post('/admin/imoveis', payload);
        if (arquivosNovos.length > 0) {
          await enviarArquivosParaApi(
            data.id,
            arquivosNovos.map((item) => item.file)
          );
          arquivosNovos.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        }
        navigate('/admin', {
          replace: true,
          state: {
            mensagemSucesso: `Cadastro do imóvel "${data.titulo}" (${data.codigo_referencia}) realizado com sucesso!`,
          },
        });
      }
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao salvar imóvel.') });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSalvando(false);
    }
  }

  async function handleUploadImediato(e) {
    const selecionados = Array.from(e.target.files || []);
    if (selecionados.length === 0) return;

    if (!modoEdicao) {
      const novosItens = selecionados.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setArquivosNovos((prev) => [...prev, ...novosItens]);
      e.target.value = '';
      return;
    }

    setEnviandoFotos(true);
    setFeedback({ tipo: '', mensagem: '' });
    try {
      await enviarArquivosParaApi(id, selecionados);
      setFeedback({ tipo: 'success', mensagem: 'Fotografias enviadas com sucesso.' });
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao enviar fotografias.') });
    } finally {
      setEnviandoFotos(false);
      e.target.value = '';
    }
  }

  async function handleDefinirPrincipal(fotoId) {
    try {
      const { data } = await api.patch(`/admin/imoveis/${id}/fotos/${fotoId}/principal`);
      setFotos(data.fotos);
      setFeedback({ tipo: 'success', mensagem: 'Imagem principal atualizada.' });
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao definir imagem principal.') });
    }
  }

  async function confirmarRemocaoFoto() {
    if (!fotoParaRemover) return;
    try {
      const { data } = await api.delete(`/admin/imoveis/${id}/fotos/${fotoParaRemover.id}`);
      setFotos(data.fotos);
      setFeedback({ tipo: 'success', mensagem: 'Fotografia removida com sucesso.' });
    } catch (error) {
      setFeedback({ tipo: 'error', mensagem: extrairMensagemErro(error, 'Erro ao remover fotografia.') });
    } finally {
      setFotoParaRemover(null);
    }
  }

  if (carregandoTela) {
    return <div style={{ padding: '4rem 0' }}><div className="spinner" /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/admin/imoveis" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div>
          <h1 style={{ fontSize: '1.45rem' }}>
            {modoEdicao ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
          </h1>
        </div>
      </div>

      <AlertMessage tipo={feedback.tipo} mensagem={feedback.mensagem} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Seção 1: Identificação e Visibilidade */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', marginBottom: '1.1rem' }}>1. Identificação e Visibilidade</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Título do Anúncio *</label>
              <input
                type="text"
                name="titulo"
                className="form-control"
                placeholder="Ex.: Apartamento 3 dormitórios com vista livre próximo à praia"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Tipo de Imóvel *</label>
                <select name="tipo_imovel_id" className="form-control" value={form.tipo_imovel_id} onChange={handleChange} required>
                  {dominios.tipos_imovel.map((t) => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Finalidade *</label>
                <select name="finalidade_id" className="form-control" value={form.finalidade_id} onChange={handleChange} required>
                  {dominios.finalidades.map((f) => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Situação Atual *</label>
                <select name="situacao_id" className="form-control" value={form.situacao_id} onChange={handleChange} required>
                  {dominios.situacoes_imovel.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="publicado" checked={form.publicado} onChange={handleChange} />
                Publicado no site público (quando disponível)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} />
                Exibir em destaque na Página Inicial
              </label>
            </div>
          </div>
        </div>

        {/* Seção 2: Valores */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', marginBottom: '1.1rem' }}>2. Valores</h2>
          <div className="form-grid">
            {(finalidadeAtual === 'VENDA' || finalidadeAtual === 'AMBAS') && (
              <div className="form-group">
                <label className="form-label">Preço de Venda (R$) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="preco_venda"
                  className="form-control tabular-nums"
                  placeholder="0,00"
                  value={form.preco_venda}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {(finalidadeAtual === 'LOCACAO' || finalidadeAtual === 'AMBAS') && (
              <div className="form-group">
                <label className="form-label">Valor de Locação Mensal (R$) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="preco_locacao"
                  className="form-control tabular-nums"
                  placeholder="0,00"
                  value={form.preco_locacao}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Condomínio (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                name="valor_condominio"
                className="form-control tabular-nums"
                placeholder="0,00"
                value={form.valor_condominio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">IPTU Mensal/Anual (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                name="valor_iptu"
                className="form-control tabular-nums"
                placeholder="0,00"
                value={form.valor_iptu}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Seção 3: Localização */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', marginBottom: '1.1rem' }}>3. Localização</h2>
          <div className="form-grid" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">CEP</label>
              <input
                type="text"
                name="cep"
                className="form-control"
                placeholder="00000-000"
                value={form.cep}
                onChange={handleChange}
                onBlur={handleBuscarCep}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado (UF) *</label>
              <input
                type="text"
                name="estado"
                maxLength={2}
                className="form-control"
                value={form.estado}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cidade *</label>
              <input
                type="text"
                name="cidade"
                className="form-control"
                value={form.cidade}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bairro *</label>
              <input
                type="text"
                name="bairro"
                className="form-control"
                value={form.bairro}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Logradouro (Rua / Av.)</label>
              <input
                type="text"
                name="logradouro"
                className="form-control"
                value={form.logradouro}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Número</label>
              <input
                type="text"
                name="numero"
                className="form-control"
                value={form.numero}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Complemento</label>
              <input
                type="text"
                name="complemento"
                className="form-control"
                value={form.complemento}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            <input
              type="checkbox"
              name="exibir_endereco_completo"
              checked={form.exibir_endereco_completo}
              onChange={handleChange}
            />
            Exibir rua e número no site público (se desmarcado, apenas cidade e bairro serão divulgados)
          </label>
        </div>

        {/* Seção 4: Características e Descrição */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', marginBottom: '1.1rem' }}>4. Características e Descrição</h2>
          <div className="form-grid" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Área Total (m²)</label>
              <input type="number" step="0.01" min="0" name="area_total" className="form-control" value={form.area_total} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Área Construída (m²)</label>
              <input type="number" step="0.01" min="0" name="area_construida" className="form-control" value={form.area_construida} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Quartos</label>
              <input type="number" min="0" name="quartos" className="form-control" value={form.quartos} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Suítes</label>
              <input type="number" min="0" name="suites" className="form-control" value={form.suites} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Banheiros</label>
              <input type="number" min="0" name="banheiros" className="form-control" value={form.banheiros} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Vagas de Garagem</label>
              <input type="number" min="0" name="vagas_garagem" className="form-control" value={form.vagas_garagem} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Descrição Completa *</label>
            <textarea
              name="descricao"
              rows={5}
              className="form-control"
              placeholder="Descreva os ambientes, acabamentos, localização e pontos fortes do imóvel..."
              value={form.descricao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Diferenciais e Comodidades</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Ex.: Sacada gourmet, Piscina, Elevador..."
                value={novoDiferencial}
                onChange={(e) => setNovoDiferencial(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarDiferencial();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary" onClick={adicionarDiferencial}>
                <Plus size={16} />
                Adicionar
              </button>
            </div>

            {form.diferenciais.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                {form.diferenciais.map((item) => (
                  <span
                    key={item}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                    }}
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removerDiferencial(item)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'inherit' }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seção 5: Fotografias */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>5. Fotografias do Imóvel</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Formatos aceitos: JPG, PNG ou WebP (máximo 5 MB por arquivo).
          </p>

          <label
            className="btn btn-secondary"
            style={{ cursor: enviandoFotos ? 'wait' : 'pointer', width: 'fit-content' }}
          >
            <Upload size={16} />
            {enviandoFotos ? 'Enviando fotos...' : 'Selecionar Fotografias'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              disabled={enviandoFotos}
              onChange={handleUploadImediato}
            />
          </label>

          {/* Pré-visualização de fotos selecionadas no cadastro */}
          {!modoEdicao && arquivosNovos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '0.85rem',
                marginTop: '1.25rem',
              }}
            >
              {arquivosNovos.map((item, idx) => (
                <div
                  key={item.previewUrl}
                  style={{
                    border: idx === 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '0.45rem 0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: idx === 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {idx === 0 ? 'Capa Inicial' : `Foto ${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerArquivoNovo(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger-text)', cursor: 'pointer' }}
                      title="Remover seleção"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fotos já enviadas no modo de edição */}
          {modoEdicao && fotos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '1rem',
                marginTop: '1.25rem',
              }}
            >
              {fotos.map((foto) => (
                <div
                  key={foto.id}
                  style={{
                    border: foto.is_principal ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <img
                    src={foto.url}
                    alt="Fotografia do imóvel"
                    style={{ width: '100%', height: '135px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.35rem' }}>
                    {foto.is_principal ? (
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={13} fill="currentColor" />
                        Principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleDefinirPrincipal(foto.id)}
                      >
                        Definir Capa
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setFotoParaRemover(foto)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger-text)', cursor: 'pointer', padding: '0.25rem' }}
                      title="Remover fotografia"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barra Final de Ações */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Link to="/admin/imoveis" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            <Save size={16} />
            {salvando ? 'Salvando...' : 'Salvar Imóvel'}
          </button>
        </div>
      </form>

      <ConfirmModal
        aberto={Boolean(fotoParaRemover)}
        titulo="Remover fotografia"
        descricao="Deseja excluir permanentemente esta fotografia do imóvel?"
        textoConfirmar="Remover Foto"
        onCancelar={() => setFotoParaRemover(null)}
        onConfirmar={confirmarRemocaoFoto}
      />
    </div>
  );
}