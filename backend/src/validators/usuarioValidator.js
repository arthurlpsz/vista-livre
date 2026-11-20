import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter ao menos 3 caracteres.').max(120),
  email: z.string().trim().email('E-mail inválido.').max(150),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
  perfil: z.enum(['ADMIN', 'CORRETOR']).default('CORRETOR'),
});

export const atualizarUsuarioSchema = z.object({
  nome: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(150),
  perfil: z.enum(['ADMIN', 'CORRETOR']),
  ativo: z.boolean(),
  nova_senha: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres.').optional().or(z.literal('')),
});