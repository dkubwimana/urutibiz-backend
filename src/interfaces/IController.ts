import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, OptionalAuthRequest } from '@/types';

/**
 * Generic controller interface for REST API endpoints
 */
export interface IController {
  /**
   * GET /resource - List entities with pagination and filtering
   */
  index?(req: Request | OptionalAuthRequest, res: Response, next: NextFunction): Promise<void>;

  /**
   * GET /resource/:id - Get single entity by ID
   */
  show?(req: Request | OptionalAuthRequest, res: Response, next: NextFunction): Promise<void>;

  /**
   * POST /resource - Create new entity
   */
  create?(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;

  /**
   * PUT/PATCH /resource/:id - Update entity
   */
  update?(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;

  /**
   * DELETE /resource/:id - Delete entity
   */
  delete?(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;

  /**
   * POST /resource/bulk - Bulk operations
   */
  bulkOperation?(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;

  /**
   * GET /resource/:id/related - Get related entities
   */
  getRelated?(req: Request | OptionalAuthRequest, res: Response, next: NextFunction): Promise<void>;
}

/**
 * Extended controller interface with common utility methods
 */
export interface IBaseController extends IController {
  /**
   * Handle validation errors from express-validator
   */
  handleValidationErrors(req: Request, res: Response): boolean;

  /**
   * Extract pagination parameters
   */
  getPaginationParams(req: Request): { page: number; limit: number };

  /**
   * Extract sorting parameters
   */
  getSortParams(req: Request): { sortBy: string; sortOrder: 'asc' | 'desc' };

  /**
   * Check resource ownership
   */
  checkResourceOwnership(req: AuthenticatedRequest, resourceOwnerId: string): boolean;

  /**
   * Log controller action
   */
  logAction(action: string, userId: string, resourceId?: string, metadata?: object): void;

  /**
   * Handle not found responses
   */
  handleNotFound(res: Response, resource?: string): void;

  /**
   * Handle unauthorized responses
   */
  handleUnauthorized(res: Response, message?: string): void;

  /**
   * Handle forbidden responses
   */
  handleForbidden(res: Response, message?: string): void;
}
