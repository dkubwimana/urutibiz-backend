import { BaseRepository } from './BaseRepository';
import ProductImage from '@/models/ProductImage.model';
import { ProductImageData, CreateProductImageData } from '@/types/productImage.types';

class ProductImageRepository extends BaseRepository<ProductImageData, CreateProductImageData, Partial<ProductImageData>> {
  protected readonly tableName = 'product_images';
  protected readonly modelClass = ProductImage;
}

export default new ProductImageRepository();
