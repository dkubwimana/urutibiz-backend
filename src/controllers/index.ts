// =====================================================
// CONTROLLERS INDEX
// =====================================================

export { BaseController } from './BaseController';
export { UsersController } from './users.controller';
export { ProductsController } from './products.controller';
export { BookingsController } from './bookings.controller';

// Export default instances
import usersController from './users.controller';
import productsController from './products.controller';
import bookingsController from './bookings.controller';

export {
  usersController,
  productsController,
  bookingsController
};
