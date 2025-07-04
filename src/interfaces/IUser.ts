// User interface placeholder
export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
