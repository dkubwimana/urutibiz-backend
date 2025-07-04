// Product interface placeholder
export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  isActive?: boolean;
  ownerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
