import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { pool } from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const client = await pool.connect();
  try {
    console.log('Populando tabelas de domínio...');
    const sqlPath = path.join(__dirname, '001_initial_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await client.query('BEGIN');
    await client.query(sql);

    // Criação de usuário administrador inicial para testes de desenvolvimento
    // (Altere estas credenciais antes da publicação em produção)
    const adminEmail = 'admin@vistalivre.com.br';
    const senhaInicial = 'VistaLivre@2026';
    const senhaHash = await bcrypt.hash(senhaInicial, 10);

    await client.query(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo)
       VALUES ($1, $2, $3, 'ADMIN', TRUE)
       ON CONFLICT (email) DO NOTHING`,
      ['Administrador Inicial (Dev)', adminEmail, senhaHash]
    );

    await client.query('COMMIT');

    console.log('Dados iniciais inseridos com sucesso!');
    console.log(`Acesso inicial de desenvolvimento -> E-mail: ${adminEmail} | Senha: ${senhaInicial}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao executar seed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();