export function ConfirmModal({
  aberto,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  carregando = false,
  onConfirmar,
  onCancelar,
}) {
  if (!aberto) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
        zIndex: 1000,
      }}
    >
      <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
        <h3 style={{ marginBottom: '0.6rem', fontSize: '1.1rem' }}>{titulo}</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
          {descricao}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirmar} disabled={carregando}>
            {carregando ? 'Processando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}