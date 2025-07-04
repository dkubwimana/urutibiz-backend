// =====================================================
// PRODUCT AVAILABILITY TYPES
// =====================================================

export type AvailabilityType = 'available' | 'booked' | 'maintenance' | 'unavailable';

export interface ProductAvailabilityData {
  id: string;
  productId: string;
  date: string; // ISO date
  availabilityType: AvailabilityType;
  priceOverride?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date; // <-- Add for BaseModel compatibility
}

export interface CreateProductAvailabilityData {
  productId: string;
  date: string;
  availabilityType?: AvailabilityType;
  priceOverride?: number;
  notes?: string;
}
