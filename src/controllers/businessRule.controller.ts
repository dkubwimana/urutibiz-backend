import { Request, Response } from 'express';
import { businessRules } from '@/config/businessRules';
import AuditLogService from '@/services/auditLog.service';

export class BusinessRuleController {
  static getRules(req: Request, res: Response) {
    res.json(businessRules);
  }

  static async updateRule(req: Request, res: Response) {
    const { entity, rule, value, active } = req.body;
    const adminId = (req as any).user?.id || 'unknown';
    const ip = req.ip;
    if (!entity || !rule) {
      return res.status(400).json({ message: 'Entity and rule are required.' });
    }
    if (!(entity in businessRules)) {
      return res.status(404).json({ message: 'Entity not found.' });
    }
    const oldValue = (businessRules as any)[entity]?.[rule];
    // Support deactivation by setting a rule to inactive (null/false)
    if (active === false) {
      (businessRules as any)[entity][rule] = null;
    } else {
      (businessRules as any)[entity][rule] = value;
    }
    await AuditLogService.log({
      timestamp: new Date().toISOString(),
      adminId,
      action: 'update_rule',
      entity,
      rule,
      oldValue,
      newValue: active === false ? null : value,
      ip
    });
    res.json({ message: 'Rule updated.', businessRules });
  }
}

export default BusinessRuleController;
