// Common types used across the application

import type { UserRole } from './user.types';

export type Environment = 'development' | 'production' | 'test' | 'staging' | 'demo';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

// export type UserRole = 'admin' | 'user' | 'business_owner' | 'service_provider';

export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  filters?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  iat?: number;
  exp?: number;
  jti?: string;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  filename: string;
  path: string;
  url?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
  }>;
}

export interface SMSOptions {
  to: string;
  message: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
}

export interface DatabaseTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'digital_wallet' 
  | 'cash';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}
