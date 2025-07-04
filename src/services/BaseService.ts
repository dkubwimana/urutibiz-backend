import { IService } from '@/interfaces/IService';
import { IRepository } from '@/interfaces/IRepository';
import { BaseModel, ServiceResponse, PaginationResult, ValidationError } from '@/types';
import logger from '@/utils/logger';

/**
 * Generic base service implementation
 */
export abstract class BaseService<T extends BaseModel, CreateData = Partial<T>, UpdateData = Partial<T>> 
  implements IService<T, CreateData, UpdateData> {
  
  protected constructor(
    protected readonly repository: IRepository<T, CreateData, UpdateData>
  ) {}

  /**
   * Abstract validation methods to be implemented by concrete services
   */
  protected abstract validateCreate(data: CreateData): Promise<ValidationError[]>;
  protected abstract validateUpdate(data: UpdateData): Promise<ValidationError[]>;
  protected abstract applyCreateBusinessRules(data: CreateData): Promise<CreateData>;
  protected abstract applyUpdateBusinessRules(data: UpdateData, existing: T): Promise<UpdateData>;

  /**
   * Get entity by ID with business logic validation
   */
  async getById(id: string, _options: { includeDeleted?: boolean } = {}): Promise<ServiceResponse<T | null>> {
    try {
      const result = await this.repository.findById(id);
      
      if (!result.success) {
        return result;
      }

      // Apply business rules for retrieval
      if (result.data) {
        const businessRuleResult = await this.applyBusinessRules(result.data, 'get');
        if (!businessRuleResult.success) {
          return businessRuleResult;
        }
        result.data = businessRuleResult.data!;
      }

      return result;
    } catch (error) {
      logger.error('Service getById failed:', error);
      return {
        success: false,
        error: `Failed to get entity: ${error}`
      };
    }
  }

  /**
   * Get multiple entities with filtering and business rules
   */
  async getMany(
    criteria: Partial<T> = {},
    _options: { includeDeleted?: boolean; applyBusinessRules?: boolean } = {}
  ): Promise<ServiceResponse<T[]>> {
    try {
      const result = await this.repository.findMany(criteria);
      
      if (!result.success) {
        return result;
      }

      // Apply business rules if requested
      if (_options.applyBusinessRules !== false && result.data) {
        const processedEntities: T[] = [];
        for (const entity of result.data) {
          const businessRuleResult = await this.applyBusinessRules(entity, 'list');
          if (businessRuleResult.success && businessRuleResult.data) {
            processedEntities.push(businessRuleResult.data);
          }
        }
        result.data = processedEntities;
      }

      return result;
    } catch (error) {
      logger.error('Service getMany failed:', error);
      return {
        success: false,
        error: `Failed to get entities: ${error}`
      };
    }
  }

  /**
   * Get paginated entities with business logic
   */
  async getPaginated(
    criteria: Partial<T> = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    _options: { includeDeleted?: boolean } = {}
  ): Promise<ServiceResponse<PaginationResult<T>>> {
    try {
      const result = await this.repository.findPaginated(criteria, page, limit, sortBy, sortOrder);
      
      if (!result.success) {
        return result;
      }

      // Apply business rules to each entity
      if (result.data?.data) {
        const processedEntities: T[] = [];
        for (const entity of result.data.data) {
          const businessRuleResult = await this.applyBusinessRules(entity, 'list');
          if (businessRuleResult.success && businessRuleResult.data) {
            processedEntities.push(businessRuleResult.data);
          }
        }
        result.data.data = processedEntities;
      }

      return result;
    } catch (error) {
      logger.error('Service getPaginated failed:', error);
      return {
        success: false,
        error: `Failed to get paginated entities: ${error}`
      };
    }
  }

  /**
   * Create entity with validation and business logic
   */
  async create(
    data: CreateData,
    options: { skipValidation?: boolean; userId?: string } = {}
  ): Promise<ServiceResponse<T>> {
    try {
      // Validate data if not skipped
      if (!options.skipValidation) {
        const validationErrors = await this.validateCreate(data);
        if (validationErrors.length > 0) {
          return {
            success: false,
            error: 'Validation failed',
            errors: validationErrors.map(err => ({ field: err.field, message: err.message }))
          };
        }
      }

      // Apply business rules
      const processedData = await this.applyCreateBusinessRules(data);

      // Create entity
      const result = await this.repository.create(processedData);
      
      if (!result.success) {
        return result;
      }

      // Log creation
      if (result.data && options.userId) {
        logger.info('Entity created via service', {
          entityId: result.data.id,
          userId: options.userId,
          entityType: this.constructor.name
        });
      }

      return result;
    } catch (error) {
      logger.error('Service create failed:', error);
      return {
        success: false,
        error: `Failed to create entity: ${error}`
      };
    }
  }

  /**
   * Update entity with validation and business logic
   */
  async update(
    id: string,
    data: UpdateData,
    options: { skipValidation?: boolean; userId?: string; allowPartial?: boolean } = {}
  ): Promise<ServiceResponse<T | null>> {
    try {
      // Check if entity exists
      const existingResult = await this.repository.findById(id);
      if (!existingResult.success) {
        return existingResult;
      }
      if (!existingResult.data) {
        return {
          success: false,
          error: 'Entity not found'
        };
      }

      // Validate data if not skipped
      if (!options.skipValidation) {
        const validationErrors = await this.validateUpdate(data);
        if (validationErrors.length > 0) {
          return {
            success: false,
            error: 'Validation failed',
            errors: validationErrors.map(err => ({ field: err.field, message: err.message }))
          };
        }
      }

      // Apply business rules
      const processedData = await this.applyUpdateBusinessRules(data, existingResult.data);

      // Update entity
      const result = await this.repository.updateById(id, processedData);
      
      if (!result.success) {
        return result;
      }

      // Log update
      if (result.data && options.userId) {
        logger.info('Entity updated via service', {
          entityId: id,
          userId: options.userId,
          entityType: this.constructor.name
        });
      }

      return result;
    } catch (error) {
      logger.error('Service update failed:', error);
      return {
        success: false,
        error: `Failed to update entity: ${error}`
      };
    }
  }

  /**
   * Delete entity with business logic
   */
  async delete(
    id: string,
    options: { hard?: boolean; userId?: string; cascade?: boolean } = {}
  ): Promise<ServiceResponse<boolean>> {
    try {
      // Check if entity exists
      const existingResult = await this.repository.findById(id);
      if (!existingResult.success) {
        return {
          success: false,
          error: existingResult.error || 'Entity not found'
        };
      }
      if (!existingResult.data) {
        return {
          success: false,
          error: 'Entity not found'
        };
      }

      // Apply business rules for deletion
      const canDelete = await this.canDelete(existingResult.data, options);
      if (!canDelete.success) {
        return canDelete;
      }

      // Delete entity
      const result = await this.repository.deleteById(id, !options.hard);
      
      if (!result.success) {
        return result;
      }

      // Log deletion
      if (options.userId) {
        logger.info(`Entity ${options.hard ? 'hard ' : 'soft '}deleted via service`, {
          entityId: id,
          userId: options.userId,
          entityType: this.constructor.name
        });
      }

      return result;
    } catch (error) {
      logger.error('Service delete failed:', error);
      return {
        success: false,
        error: `Failed to delete entity: ${error}`
      };
    }
  }

  /**
   * Validate entity data
   */
  async validate(data: Partial<T>, context: 'create' | 'update' = 'create'): Promise<ServiceResponse<boolean, ValidationError[]>> {
    try {
      let validationErrors: ValidationError[];
      if (context === 'create') {
        validationErrors = await this.validateCreate(data as CreateData);
      } else {
        validationErrors = await this.validateUpdate(data as UpdateData);
      }
      if (validationErrors.length === 0) {
        return {
          success: true,
          data: true
        };
      } else {
        return {
          success: false,
          data: false,
          errors: validationErrors
        };
      }
    } catch (error) {
      logger.error('Service validate failed:', error);
      return {
        success: false,
        data: false,
        errors: [{ field: 'general', message: `Validation failed: ${error}` }]
      };
    }
  }

  /**
   * Check if entity exists
   */
  async exists(criteria: Partial<T>): Promise<ServiceResponse<boolean>> {
    return await this.repository.exists(criteria);
  }

  /**
   * Count entities
   */
  async count(criteria: Partial<T> = {}): Promise<ServiceResponse<number>> {
    return await this.repository.count(criteria);
  }

  /**
   * Bulk create operations
   */
  async bulkCreate(data: CreateData[], options: { skipValidation?: boolean } = {}): Promise<ServiceResponse<T[]>> {
    try {
      const results: T[] = [];
      const errors: any[] = [];

      for (const item of data) {
        const result = await this.create(item, options);
        if (result.success && result.data) {
          results.push(result.data);
        } else {
          errors.push({ data: item, error: result.error });
        }
      }

      return {
        success: errors.length === 0,
        data: results,
        errors: errors.length > 0 ? errors : undefined,
        metadata: { created: results.length, failed: errors.length }
      };
    } catch (error) {
      logger.error('Service bulkCreate failed:', error);
      return {
        success: false,
        error: `Failed to bulk create entities: ${error}`
      };
    }
  }

  /**
   * Bulk update operations
   */
  async bulkUpdate(criteria: Partial<T>, data: UpdateData, _options: { skipValidation?: boolean } = {}): Promise<ServiceResponse<{ affected: number }>> {
    return await this.repository.updateMany(criteria, data);
  }

  /**
   * Bulk delete operations
   */
  async bulkDelete(criteria: Partial<T>, options: { hard?: boolean } = {}): Promise<ServiceResponse<{ affected: number }>> {
    return await this.repository.deleteMany(criteria, !options.hard);
  }

  /**
   * Apply business rules to entity
   */
  async applyBusinessRules(entity: T, _context?: string): Promise<ServiceResponse<T>> {
    try {
      // Default implementation - override in concrete services
      return {
        success: true,
        data: entity
      };
    } catch (error) {
      logger.error('Apply business rules failed:', error);
      return {
        success: false,
        error: `Failed to apply business rules: ${error}`
      };
    }
  }

  /**
   * Execute service-specific operations
   */
  async executeOperation(operation: string, _params: any): Promise<ServiceResponse<any>> {
    try {
      // Default implementation - override in concrete services
      return {
        success: false,
        error: `Operation '${operation}' not implemented`
      };
    } catch (error) {
      logger.error('Execute operation failed:', error);
      return {
        success: false,
        error: `Failed to execute operation: ${error}`
      };
    }
  }

  /**
   * Check if entity can be deleted (business rules)
   */
  protected async canDelete(_entity: T, _options: any): Promise<ServiceResponse<boolean>> {
    // Default implementation - override in concrete services
    return {
      success: true,
      data: true
    };
  }
}
