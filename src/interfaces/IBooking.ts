// Booking interface placeholder
export interface IBooking {
  id: string;
  userId: string;
  productId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
