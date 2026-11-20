import { Router } from 'express';
import { adminUsuariosController } from '../controllers/adminUsuariosController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware, authorizeRoles('ADMIN'));

router.get('/', adminUsuariosController.listar);
router.post('/', adminUsuariosController.criar);
router.put('/:id', adminUsuariosController.atualizar);

export default router;