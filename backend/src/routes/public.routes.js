import { Router } from 'express';
import { publicController } from '../controllers/publicController.js';

const router = Router();

router.get('/imoveis', publicController.listarImoveis);
router.get('/imoveis/:codigo', publicController.detalharImovel);
router.get('/filtros', publicController.obterOpcoesFiltro);

export default router;