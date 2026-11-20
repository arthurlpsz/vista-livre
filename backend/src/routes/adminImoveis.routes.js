import { Router } from 'express';
import { adminImoveisController } from '../controllers/adminImoveisController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadFotosMiddleware } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Todas as rotas abaixo exigem funcionário autenticado
router.use(authMiddleware);

router.get('/dashboard', adminImoveisController.dashboard);
router.get('/dominios', adminImoveisController.dominios);

router.get('/', adminImoveisController.listar);
router.post('/', adminImoveisController.criar);
router.get('/:id', adminImoveisController.detalhar);
router.put('/:id', adminImoveisController.atualizar);
router.patch('/:id/situacao', adminImoveisController.alterarSituacao);
router.delete('/:id', adminImoveisController.arquivar);

// Gerenciamento de fotografias (Supabase Storage)
router.post('/:id/fotos', uploadFotosMiddleware, adminImoveisController.uploadFotos);
router.patch('/:id/fotos/:fotoId/principal', adminImoveisController.definirFotoPrincipal);
router.delete('/:id/fotos/:fotoId', adminImoveisController.removerFoto);

export default router;