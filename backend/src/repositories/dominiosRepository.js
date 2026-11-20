import { pool } from '../config/database.js';

export const dominiosRepository = {
  async listarDominios() {
    const [tipos, finalidades, situacoes] = await Promise.all([
      pool.query('SELECT id, nome FROM tipos_imovel WHERE ativo = TRUE ORDER BY nome ASC'),
      pool.query('SELECT id, codigo, nome FROM finalidades ORDER BY id ASC'),
      pool.query('SELECT id, codigo, nome, visivel_publico FROM situacoes_imovel ORDER BY id ASC'),
    ]);

    return {
      tipos_imovel: tipos.rows,
      finalidades: finalidades.rows,
      situacoes_imovel: situacoes.rows,
    };
  },

  async findFinalidadeById(id) {
    const { rows } = await pool.query('SELECT id, codigo, nome FROM finalidades WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findSituacaoById(id) {
    const { rows } = await pool.query(
      'SELECT id, codigo, nome, visivel_publico FROM situacoes_imovel WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },
};