import { businessRules } from '@/config/businessRules';

export type RuleContext = {
  user?: { id: string; role: string };
  [key: string]: any;
};

export class BusinessRuleService {
  static getRule(entity: keyof typeof businessRules, rule: string) {
    return (businessRules as any)[entity]?.[rule];
  }

  static async checkRule(entity: keyof typeof businessRules, rule: string, context: RuleContext): Promise<boolean> {
    const value = this.getRule(entity, rule);
    if (typeof value === 'function') {
      return await value(context);
    }
    if (Array.isArray(value)) {
      return !!(context.user && value.includes(context.user.role));
    }
    return !!value;
  }

  static async enforce(entity: keyof typeof businessRules, rule: string, context: RuleContext, errorMsg?: string) {
    const allowed = await this.checkRule(entity, rule, context);
    if (!allowed) {
      throw new Error(errorMsg || `Business rule violation: ${entity}.${rule}`);
    }
  }
}

export default BusinessRuleService;
