import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    status: 'nao_encontrado',
    mensagem: 'Rota não encontrada na API.',
  });
});

app.use(errorHandler);

export default app;