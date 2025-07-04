import { BaseRepository } from './BaseRepository';
import Product from '@/models/Product.model';
import { ProductData, CreateProductData, UpdateProductData } from '@/types/product.types';

class ProductRepository extends BaseRepository<ProductData, CreateProductData, UpdateProductData> {
  protected readonly tableName = 'products';
  protected readonly modelClass = Product;
}

export default new ProductRepository();
