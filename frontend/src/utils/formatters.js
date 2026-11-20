export function formatCurrency(valor) {
  if (valor === null || valor === undefined || valor === '') return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor));
}

export function formatArea(valor) {
  if (!valor) return '—';
  return `${Number(valor).toLocaleString('pt-BR')} m²`;
}

export function extrairMensagemErro(error, fallback = 'Ocorreu um erro inesperado.') {
  if (error?.response?.data?.erros?.length) {
    return error.response.data.erros.map((e) => e.mensagem).join(' ');
  }
  return error?.response?.data?.mensagem || fallback;
}