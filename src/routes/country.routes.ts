// =====================================================
// COUNTRY ROUTES
// =====================================================

import { Router } from 'express';
import { CountryController } from '@/controllers/country.controller';
import { authenticateToken as auth, requireRole } from '@/middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier
 *         code:
 *           type: string
 *           description: ISO 3166-1 alpha-2 country code
 *           example: "RW"
 *         code_alpha3:
 *           type: string
 *           description: ISO 3166-1 alpha-3 country code
 *           example: "RWA"
 *         name:
 *           type: string
 *           description: Country name
 *           example: "Rwanda"
 *         local_name:
 *           type: string
 *           description: Local language name
 *           example: "Rwanda"
 *         currency_code:
 *           type: string
 *           description: ISO 4217 currency code
 *           example: "RWF"
 *         currency_symbol:
 *           type: string
 *           description: Currency symbol
 *           example: "FRw"
 *         phone_prefix:
 *           type: string
 *           description: International dialing prefix
 *           example: "+250"
 *         timezone:
 *           type: string
 *           description: Timezone identifier
 *           example: "Africa/Kigali"
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Supported languages
 *           example: ["rw", "en", "fr"]
 *         is_active:
 *           type: boolean
 *           description: Whether the country is active
 *           example: true
 *         launch_date:
 *           type: string
 *           format: date
 *           description: When UrutiBiz launched in this country
 *           example: "2025-01-01"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

// Public routes (no authentication required)
router.get('/', CountryController.getCountries);
router.get('/active', CountryController.getActiveCountries);
router.get('/search', CountryController.searchCountries);
router.get('/code/:code', CountryController.getCountryByCode);
router.get('/currency/:currency_code', CountryController.getCountriesByCurrency);
router.get('/language/:language', CountryController.getCountriesByLanguage);
router.get('/:id', CountryController.getCountryById);

// Protected routes (authentication required)
router.use(auth); // All routes below require authentication

// Admin-only routes
router.post('/', requireRole(['admin']), CountryController.createCountry);
router.put('/:id', requireRole(['admin']), CountryController.updateCountry);
router.delete('/:id', requireRole(['admin']), CountryController.deleteCountry);
router.delete('/:id/hard-delete', requireRole(['admin']), CountryController.hardDeleteCountry);
router.patch('/:id/toggle-status', requireRole(['admin']), CountryController.toggleCountryStatus);
router.get('/stats', requireRole(['admin']), CountryController.getCountryStats);

export default router;
