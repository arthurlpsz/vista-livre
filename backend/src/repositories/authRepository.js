import { pool } from '../config/database.js';

export const authRepository = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT id, nome, email, senha_hash, perfil, ativo FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, nome, email, perfil, ativo, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },
};