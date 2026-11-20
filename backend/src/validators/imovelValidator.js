import { z } from 'zod';

const nullablePositiveNumber = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return Number.isNaN(num) ? NaN : num;
  })
  .refine((val) => val === null || (!Number.isNaN(val) && val > 0), {
    message: 'O valor deve ser maior que zero.',
  });

const nullableNonNegativeNumber = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return Number.isNaN(num) ? NaN : num;
  })
  .refine((val) => val === null || (!Number.isNaN(val) && val >= 0), {
    message: 'O valor não pode ser negativo.',
  });

export const imovelSchema = z.object({
  titulo: z.string().trim().min(5, 'O título deve ter no mínimo 5 caracteres.').max(180),
  descricao: z.string().trim().min(15, 'A descrição deve ter no mínimo 15 caracteres.'),
  tipo_imovel_id: z.coerce.number().int().positive('Selecione o tipo do imóvel.'),
  finalidade_id: z.coerce.number().int().positive('Selecione a finalidade.'),
  situacao_id: z.coerce.number().int().positive('Selecione a situação do imóvel.'),
  publicado: z.boolean().default(false),
  destaque: z.boolean().default(false),

  preco_venda: nullablePositiveNumber,
  preco_locacao: nullablePositiveNumber,
  valor_condominio: nullableNonNegativeNumber,
  valor_iptu: nullableNonNegativeNumber,

  cep: z.string().trim().max(9).nullable().optional().or(z.literal('')),
  estado: z.string().trim().length(2, 'UF deve ter 2 letras.').default('SP'),
  cidade: z.string().trim().min(2, 'Informe a cidade.').max(100),
  bairro: z.string().trim().min(2, 'Informe o bairro.').max(100),
  logradouro: z.string().trim().max(180).nullable().optional().or(z.literal('')),
  numero: z.string().trim().max(20).nullable().optional().or(z.literal('')),
  complemento: z.string().trim().max(100).nullable().optional().or(z.literal('')),
  exibir_endereco_completo: z.boolean().default(false),

  area_total: nullablePositiveNumber,
  area_construida: nullablePositiveNumber,
  quartos: z.coerce.number().int().min(0).default(0),
  suites: z.coerce.number().int().min(0).default(0),
  banheiros: z.coerce.number().int().min(0).default(0),
  vagas_garagem: z.coerce.number().int().min(0).default(0),
  diferenciais: z.array(z.string().trim().min(1)).default([]),
});

export const alterarSituacaoSchema = z.object({
  situacao_id: z.coerce.number().int().positive('Selecione uma situação válida.'),
});