import { ProductAvailabilityData } from '@/types/productAvailability.types';

export class ProductAvailability implements ProductAvailabilityData {
  id: string;
  productId: string;
  date: string;
  availabilityType: 'available' | 'booked' | 'maintenance' | 'unavailable';
  priceOverride?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ProductAvailabilityData) {
    this.id = data.id;
    this.productId = data.productId;
    this.date = data.date;
    this.availabilityType = data.availabilityType;
    this.priceOverride = data.priceOverride;
    this.notes = data.notes;
    this.createdAt = typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
    this.updatedAt = typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : data.updatedAt;
  }
}

export default ProductAvailability;
