import { pool } from '../config/database.js';

export const usuariosRepository = {
  async listarTodos() {
    const { rows } = await pool.query(
      'SELECT id, nome, email, perfil, ativo, created_at FROM usuarios ORDER BY nome ASC'
    );
    return rows;
  },

  async criar({ nome, email, senha_hash, perfil }) {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING id, nome, email, perfil, ativo, created_at`,
      [nome, email, senha_hash, perfil]
    );
    return rows[0];
  },

  async atualizar(id, { nome, email, perfil, ativo, senha_hash }) {
    if (senha_hash) {
      const { rows } = await pool.query(
        `UPDATE usuarios
         SET nome = $1, email = $2, perfil = $3, ativo = $4, senha_hash = $5
         WHERE id = $6
         RETURNING id, nome, email, perfil, ativo, created_at`,
        [nome, email, perfil, ativo, senha_hash, id]
      );
      return rows[0] || null;
    }

    const { rows } = await pool.query(
      `UPDATE usuarios
       SET nome = $1, email = $2, perfil = $3, ativo = $4
       WHERE id = $5
       RETURNING id, nome, email, perfil, ativo, created_at`,
      [nome, email, perfil, ativo, id]
    );
    return rows[0] || null;
  },
};