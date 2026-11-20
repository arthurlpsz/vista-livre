export function AlertMessage({ tipo = 'error', mensagem }) {
  if (!mensagem) return null;
  return <div className={`alert alert-${tipo}`}>{mensagem}</div>;
}