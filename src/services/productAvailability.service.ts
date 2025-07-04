import ProductAvailabilityRepository from '@/repositories/ProductAvailabilityRepository';
import { ProductAvailabilityData, CreateProductAvailabilityData, AvailabilityType } from '@/types/productAvailability.types';
import { ValidationError } from '@/types';

class ProductAvailabilityService {
  async create(data: CreateProductAvailabilityData) {
    // Basic validation
    const errors: ValidationError[] = [];
    if (!data.productId) errors.push({ field: 'productId', message: 'Product ID is required' });
    if (!data.date) errors.push({ field: 'date', message: 'Date is required' });
    if (errors.length > 0) return { success: false, error: errors.map(e => e.message).join(', ') };
    return ProductAvailabilityRepository.create(data);
  }

  async getByProduct(productId: string) {
    return ProductAvailabilityRepository.findMany({ productId });
  }

  async setAvailability(productId: string, date: string, type: AvailabilityType, priceOverride?: number, notes?: string) {
    // Upsert logic: if exists, update; else, create
    const existing = await ProductAvailabilityRepository.findMany({ productId, date });
    if (existing.data && existing.data.length > 0) {
      return ProductAvailabilityRepository.updateMany({ productId, date }, { availabilityType: type, priceOverride, notes });
    } else {
      return ProductAvailabilityRepository.create({ productId, date, availabilityType: type, priceOverride, notes });
    }
  }

  async delete(id: string) {
    return ProductAvailabilityRepository.deleteById(id, false);
  }
}

export default new ProductAvailabilityService();
