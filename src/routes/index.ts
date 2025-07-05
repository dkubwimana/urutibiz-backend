import { Router } from 'express';

// Import route modules
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import productRoutes from './products.routes';
import bookingRoutes from './bookings.routes';
import userVerificationRoutes from './userVerification.routes';
import adminVerificationRoutes from './adminVerification.routes';
import documentManagementRoutes from './documentManagement.routes';
import categoriesRoutes from './categories.routes';
import productImagesRoutes from './productImages.routes';
import productAvailabilityRoutes from './productAvailability.routes';
import businessRulesRoutes from './businessRules.routes';
import countryRoutes from './country.routes';

const router = Router();

// Health check route
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/bookings', bookingRoutes);
router.use('/user-verification', userVerificationRoutes);
router.use('/admin', adminVerificationRoutes);
router.use('/documents', documentManagementRoutes);
router.use('/api/categories', categoriesRoutes);
router.use('/product-images', productImagesRoutes);
router.use('/product-availability', productAvailabilityRoutes);
router.use('/business-rules', businessRulesRoutes);
router.use('/countries', countryRoutes);

// Placeholder routes - remove when actual routes are implemented
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'UrutiBiz API v1.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      products: '/api/v1/products',
      bookings: '/api/v1/bookings',
      countries: '/api/v1/countries',
      payments: '/api/v1/payments',
      reviews: '/api/v1/reviews',
      messages: '/api/v1/messages',
      ai: '/api/v1/ai',
      admin: '/api/v1/admin',
      analytics: '/api/v1/analytics',
    },
  });
});

export default router;
