import { BaseModel, PaginationResult, ServiceResponse } from '@/types';

/**
 * Generic repository interface for database operations
 */
export interface IRepository<T extends BaseModel, CreateData = Partial<T>, UpdateData = Partial<T>> {
  /**
   * Create a new entity
   */
  create(data: CreateData): Promise<ServiceResponse<T>>;

  /**
   * Find entity by ID
   */
  findById(id: string): Promise<ServiceResponse<T | null>>;

  /**
   * Find entity by field
   */
  findBy(field: keyof T, value: any): Promise<ServiceResponse<T | null>>;

  /**
   * Find multiple entities by criteria
   */
  findMany(criteria?: Partial<T>): Promise<ServiceResponse<T[]>>;

  /**
   * Find entities with pagination
   */
  findPaginated(
    criteria?: Partial<T>,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<ServiceResponse<PaginationResult<T>>>;

  /**
   * Update entity by ID
   */
  updateById(id: string, data: UpdateData): Promise<ServiceResponse<T | null>>;

  /**
   * Update multiple entities
   */
  updateMany(criteria: Partial<T>, data: UpdateData): Promise<ServiceResponse<{ affected: number }>>;

  /**
   * Delete entity by ID (soft delete if supported)
   */
  deleteById(id: string, soft?: boolean): Promise<ServiceResponse<boolean>>;

  /**
   * Delete multiple entities
   */
  deleteMany(criteria: Partial<T>, soft?: boolean): Promise<ServiceResponse<{ affected: number }>>;

  /**
   * Check if entity exists
   */
  exists(criteria: Partial<T>): Promise<ServiceResponse<boolean>>;

  /**
   * Count entities matching criteria
   */
  count(criteria?: Partial<T>): Promise<ServiceResponse<number>>;

  /**
   * Execute raw query/operation
   */
  raw(query: string, params?: any[]): Promise<ServiceResponse<any>>;

  /**
   * Begin database transaction
   */
  beginTransaction(): Promise<any>;

  /**
   * Commit database transaction
   */
  commitTransaction(transaction: any): Promise<void>;

  /**
   * Rollback database transaction
   */
  rollbackTransaction(transaction: any): Promise<void>;
}
