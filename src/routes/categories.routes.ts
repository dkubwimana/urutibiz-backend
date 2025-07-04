import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, requireRole(['admin', 'moderator']), CategoryController.createCategory);
router.get('/:id', CategoryController.getCategoryById);
router.get('/', CategoryController.listCategories);

export default router;
