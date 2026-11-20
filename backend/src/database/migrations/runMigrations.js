import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Iniciando execução das migrations no PostgreSQL...');
    const sqlPath = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('Tabelas, relacionamentos e índices criados com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao executar migrations:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();