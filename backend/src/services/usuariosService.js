import bcrypt from 'bcrypt';
import { usuariosRepository } from '../repositories/usuariosRepository.js';
import { authRepository } from '../repositories/authRepository.js';
import { AppError } from '../utils/AppError.js';

export const usuariosService = {
  async listar() {
    return usuariosRepository.listarTodos();
  },

  async criar({ nome, email, senha, perfil }) {
    const jaExiste = await authRepository.findByEmail(email);
    if (jaExiste) {
      throw new AppError('Já existe um funcionário cadastrado com este e-mail.', 409);
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    return usuariosRepository.criar({ nome, email, senha_hash, perfil });
  },

  async atualizar(id, dados, usuarioLogadoId) {
    const alvo = await authRepository.findById(id);
    if (!alvo) {
      throw new AppError('Funcionário não encontrado.', 404);
    }

    if (Number(id) === Number(usuarioLogadoId) && dados.ativo === false) {
      throw new AppError('Você não pode desativar a sua própria conta.', 400);
    }

    const outroComMesmoEmail = await authRepository.findByEmail(dados.email);
    if (outroComMesmoEmail && outroComMesmoEmail.id !== Number(id)) {
      throw new AppError('Este e-mail já está em uso por outro funcionário.', 409);
    }

    const senha_hash = dados.nova_senha ? await bcrypt.hash(dados.nova_senha, 10) : null;

    return usuariosRepository.atualizar(id, {
      nome: dados.nome,
      email: dados.email,
      perfil: dados.perfil,
      ativo: dados.ativo,
      senha_hash,
    });
  },
};