import { BaseModel, PaginationResult, ServiceResponse, ValidationError } from '@/types';

/**
 * Generic service interface for business logic operations
 */
export interface IService<T extends BaseModel, CreateData = Partial<T>, UpdateData = Partial<T>> {
  /**
   * Get entity by ID with business logic validation
   */
  getById(id: string, options?: { includeDeleted?: boolean }): Promise<ServiceResponse<T | null>>;

  /**
   * Get multiple entities with filtering and business rules
   */
  getMany(criteria?: Partial<T>, options?: {
    includeDeleted?: boolean;
    applyBusinessRules?: boolean;
  }): Promise<ServiceResponse<T[]>>;

  /**
   * Get paginated entities with business logic
   */
  getPaginated(
    criteria?: Partial<T>,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    options?: { includeDeleted?: boolean }
  ): Promise<ServiceResponse<PaginationResult<T>>>;

  /**
   * Create entity with validation and business logic
   */
  create(data: CreateData, options?: { 
    skipValidation?: boolean;
    userId?: string;
  }): Promise<ServiceResponse<T>>;

  /**
   * Update entity with validation and business logic
   */
  update(
    id: string, 
    data: UpdateData, 
    options?: { 
      skipValidation?: boolean;
      userId?: string;
      allowPartial?: boolean;
    }
  ): Promise<ServiceResponse<T | null>>;

  /**
   * Delete entity with business logic (soft delete by default)
   */
  delete(
    id: string, 
    options?: { 
      hard?: boolean;
      userId?: string;
      cascade?: boolean;
    }
  ): Promise<ServiceResponse<boolean>>;

  /**
   * Validate entity data
   */
  validate(data: Partial<T>, context?: 'create' | 'update'): Promise<ServiceResponse<boolean, ValidationError[]>>;

  /**
   * Check if entity exists
   */
  exists(criteria: Partial<T>): Promise<ServiceResponse<boolean>>;

  /**
   * Count entities
   */
  count(criteria?: Partial<T>): Promise<ServiceResponse<number>>;

  /**
   * Bulk operations
   */
  bulkCreate(data: CreateData[], options?: { skipValidation?: boolean }): Promise<ServiceResponse<T[]>>;
  bulkUpdate(criteria: Partial<T>, data: UpdateData, options?: { skipValidation?: boolean }): Promise<ServiceResponse<{ affected: number }>>;
  bulkDelete(criteria: Partial<T>, options?: { hard?: boolean }): Promise<ServiceResponse<{ affected: number }>>;

  /**
   * Apply business rules to entity
   */
  applyBusinessRules(entity: T, context?: string): Promise<ServiceResponse<T>>;

  /**
   * Execute service-specific operations
   */
  executeOperation(operation: string, params: any): Promise<ServiceResponse<any>>;
}
