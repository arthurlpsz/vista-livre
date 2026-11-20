import dotenv from 'dotenv';
import app from './app.js';
import { pool } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Conexão com PostgreSQL verificada com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor da Vista Livre rodando em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Falha ao conectar no PostgreSQL ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();