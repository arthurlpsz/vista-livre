import { pool } from '../config/database.js';

export const fotosRepository = {
  async listarPorImovel(imovelId, db = pool) {
    const { rows } = await db.query(
      `SELECT id, imovel_id, url, storage_key, legenda, is_principal, ordem, created_at
       FROM imovel_fotos
       WHERE imovel_id = $1
       ORDER BY is_principal DESC, ordem ASC, id ASC`,
      [imovelId]
    );
    return rows;
  },

  async findById(fotoId, imovelId, db = pool) {
    const { rows } = await db.query(
      'SELECT * FROM imovel_fotos WHERE id = $1 AND imovel_id = $2',
      [fotoId, imovelId]
    );
    return rows[0] || null;
  },

  async inserirFoto({ imovelId, url, storageKey, legenda, isPrincipal, ordem }, db = pool) {
    const { rows } = await db.query(
      `INSERT INTO imovel_fotos (imovel_id, url, storage_key, legenda, is_principal, ordem)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [imovelId, url, storageKey, legenda || null, isPrincipal, ordem]
    );
    return rows[0];
  },

  async definirPrincipal(imovelId, fotoId, db = pool) {
    await db.query('UPDATE imovel_fotos SET is_principal = FALSE WHERE imovel_id = $1', [imovelId]);
    const { rows } = await db.query(
      'UPDATE imovel_fotos SET is_principal = TRUE WHERE id = $1 AND imovel_id = $2 RETURNING *',
      [fotoId, imovelId]
    );
    return rows[0] || null;
  },

  async excluirFoto(fotoId, imovelId, db = pool) {
    const { rows } = await db.query(
      'DELETE FROM imovel_fotos WHERE id = $1 AND imovel_id = $2 RETURNING *',
      [fotoId, imovelId]
    );
    return rows[0] || null;
  },
};