// =====================================================
// PRODUCT IMAGE TYPES
// =====================================================

export interface ProductImageData {
  id: string;
  productId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  aiAnalysis?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date; // <-- Change this to Date for BaseModel compatibility
}

export interface CreateProductImageData {
  productId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  aiAnalysis?: Record<string, any>;
}
