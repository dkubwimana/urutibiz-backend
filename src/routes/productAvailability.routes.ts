import { Router } from 'express';
import ProductAvailabilityController from '@/controllers/productAvailability.controller';

const router = Router();

router.post('/', ProductAvailabilityController.create);
router.get('/product/:productId', ProductAvailabilityController.getByProduct);
router.post('/set', ProductAvailabilityController.setAvailability);
router.delete('/:id', ProductAvailabilityController.delete);

export default router;
