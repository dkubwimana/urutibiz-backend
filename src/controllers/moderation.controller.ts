import { Request, Response } from 'express';
import { ModerationRule, ModerationConfig } from '@/types/moderation.types';
import ModerationService from '@/services/moderation.service';

/**
 * Moderation Controller for Automated Moderation Workflows
 */
export default class ModerationController {
  /**
   * Get current moderation config
   */
  static async getConfig(req: Request, res: Response) {
    const config = await ModerationService.getConfig();
    res.json(config);
  }

  /**
   * Update moderation config
   */
  static async updateConfig(req: Request, res: Response) {
    const updated = await ModerationService.updateConfig(req.body);
    res.json(updated);
  }

  /**
   * List moderation rules
   */
  static async listRules(req: Request, res: Response) {
    const rules = await ModerationService.listRules();
    res.json(rules);
  }

  /**
   * Create a moderation rule
   */
  static async createRule(req: Request, res: Response) {
    const rule = await ModerationService.createRule(req.body);
    res.status(201).json(rule);
  }

  /**
   * Update a moderation rule
   */
  static async updateRule(req: Request, res: Response) {
    const rule = await ModerationService.updateRule(req.params.id, req.body);
    res.json(rule);
  }

  /**
   * Delete a moderation rule
   */
  static async deleteRule(req: Request, res: Response) {
    await ModerationService.deleteRule(req.params.id);
    res.status(204).send();
  }

  /**
   * Get moderation queue
   */
  static async getQueue(req: Request, res: Response) {
    const queue = await ModerationService.getQueue();
    res.json(queue);
  }

  /**
   * Get moderation metrics
   */
  static async getMetrics(req: Request, res: Response) {
    const metrics = await ModerationService.getMetrics();
    res.json(metrics);
  }

  /**
   * Manual moderation trigger
   */
  static async triggerModeration(req: Request, res: Response) {
    const result = await ModerationService.triggerModeration(req.body);
    res.json(result);
  }
}
