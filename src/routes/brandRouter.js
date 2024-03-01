import { Router } from 'express';
import checkRole from '../middleware/checkRoleMiddleware.js';
const router = new Router();
import brandController from '../controllers/brandController.js';

router.post('/', checkRole('ADMIN'), brandController.create);
router.get('/', brandController.getAll);

export default router;
