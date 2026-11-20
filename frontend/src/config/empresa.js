export const EMPRESA_CONFIG = {
  nomeFantasia: 'Vista Livre Imóveis',
  razaoSocial: 'Vista Livre Negócios Imobiliários LTDA',
  creci: 'CRECI-SP (A definir pela empresa)',
  whatsappNumero: '5513999999999',
  whatsappExibicao: '(13) 99999-9999',
  telefoneExibicao: '(13) 3333-0000',
  emailContato: 'contato@vistalivre.com.br',
  endereco: 'Endereço comercial a ser confirmado pela Vista Livre — Litoral Paulista/SP',
  horarioAtendimento: 'Segunda a Sexta, das 09h às 18h | Sábado, das 09h às 13h',
};

export function gerarLinkWhatsApp(mensagem) {
  const textoCodificado = encodeURIComponent(mensagem);
  return `https://wa.me/${EMPRESA_CONFIG.whatsappNumero}?text=${textoCodificado}`;
}