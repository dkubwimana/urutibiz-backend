import { Router } from 'express';
import ProductImageController from '@/controllers/productImage.controller';

const router = Router();

router.post('/', ProductImageController.create);
router.get('/product/:productId', ProductImageController.getByProduct);
router.post('/set-primary', ProductImageController.setPrimary);
router.delete('/:imageId', ProductImageController.delete);

export default router;
