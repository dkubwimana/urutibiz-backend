import { Router } from 'express';
import BusinessRuleController from '@/controllers/businessRule.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Only admin or super_admin can manage business rules
router.get('/', requireAuth, requireRole(['admin', 'super_admin']), BusinessRuleController.getRules);
router.post('/update', requireAuth, requireRole(['admin', 'super_admin']), BusinessRuleController.updateRule);

export default router;
