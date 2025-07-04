import { ProductImageData, CreateProductImageData } from '@/types/productImage.types';

export class ProductImage implements ProductImageData {
  id: string;
  productId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  aiAnalysis?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ProductImageData) {
    this.id = data.id;
    this.productId = data.productId;
    this.imageUrl = data.imageUrl;
    this.thumbnailUrl = data.thumbnailUrl;
    this.altText = data.altText;
    this.sortOrder = data.sortOrder;
    this.isPrimary = data.isPrimary;
    this.aiAnalysis = data.aiAnalysis;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export default ProductImage;
