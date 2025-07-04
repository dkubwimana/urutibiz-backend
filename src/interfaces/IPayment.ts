// Payment interface placeholder
export interface IPayment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
