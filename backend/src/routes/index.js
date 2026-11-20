import { Router } from 'express';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import adminImoveisRoutes from './adminImoveis.routes.js';
import adminUsuariosRoutes from './adminUsuarios.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', servico: 'API Vista Livre Imóveis' });
});

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/admin/imoveis', adminImoveisRoutes);
router.use('/admin/usuarios', adminUsuariosRoutes);

export default router;