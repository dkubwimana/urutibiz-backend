import { Request } from 'express';

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationParams;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

// Legacy types for backward compatibility
export interface ApiResponseV2<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// =====================================================
// REQUEST TYPES
// =====================================================

export interface AuthenticatedRequest extends Request {
  user: any; // Will be properly typed in specific contexts
}

export interface OptionalAuthRequest extends Request {
  user?: any;
}

// Note: ApiError is defined in common.types to avoid conflicts
