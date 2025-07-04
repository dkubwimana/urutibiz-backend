import { BaseRepository } from './BaseRepository';
import ProductAvailability from '@/models/ProductAvailability.model';
import { ProductAvailabilityData, CreateProductAvailabilityData } from '@/types/productAvailability.types';

class ProductAvailabilityRepository extends BaseRepository<ProductAvailabilityData, CreateProductAvailabilityData, Partial<ProductAvailabilityData>> {
  protected readonly tableName = 'product_availability';
  protected readonly modelClass = ProductAvailability;
}

export default new ProductAvailabilityRepository();
