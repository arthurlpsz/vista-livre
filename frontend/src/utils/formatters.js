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

export function formatarMoedaInput(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const apenasDigitos = String(valor).replace(/\D/g, '');
  if (!apenasDigitos) return '';
  const numero = Number(apenasDigitos) / 100;
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatarNumeroParaInput(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '';
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseMoedaInput(valorFormatado) {
  if (valorFormatado === null || valorFormatado === undefined || valorFormatado === '') return null;
  if (typeof valorFormatado === 'number') return valorFormatado;
  const limpo = String(valorFormatado).replace(/\./g, '').replace(',', '.').trim();
  const numero = Number(limpo);
  return Number.isNaN(numero) ? null : numero;
}

export function extrairMensagemErro(error, fallback = 'Ocorreu um erro inesperado.') {
  if (error?.response?.data?.erros?.length) {
    return error.response.data.erros.map((e) => e.mensagem).join(' ');
  }
  return error?.response?.data?.mensagem || fallback;
}