// =====================================================
// COUNTRY CONTROLLER
// =====================================================

import { Request, Response } from 'express';
import { CountryService } from '@/services/country.service';
import { CreateCountryRequest, UpdateCountryRequest, CountryFilters } from '@/types/country.types';
import { ResponseHelper } from '@/utils/response';
import logger from '@/utils/logger';

export class CountryController {

  /**
   * @swagger
   * /countries:
   *   post:
   *     summary: Create a new country
   *     tags: [Countries]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *               - code_alpha3
   *               - name
   *               - currency_code
   *             properties:
   *               code:
   *                 type: string
   *                 example: "RW"
   *                 description: "ISO 3166-1 alpha-2 country code"
   *               code_alpha3:
   *                 type: string
   *                 example: "RWA"
   *                 description: "ISO 3166-1 alpha-3 country code"
   *               name:
   *                 type: string
   *                 example: "Rwanda"
   *               local_name:
   *                 type: string
   *                 example: "Rwanda"
   *               currency_code:
   *                 type: string
   *                 example: "RWF"
   *                 description: "ISO 4217 currency code"
   *               currency_symbol:
   *                 type: string
   *                 example: "FRw"
   *               phone_prefix:
   *                 type: string
   *                 example: "+250"
   *               timezone:
   *                 type: string
   *                 example: "Africa/Kigali"
   *               languages:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["rw", "en", "fr"]
   *               is_active:
   *                 type: boolean
   *                 example: true
   *               launch_date:
   *                 type: string
   *                 format: date
   *                 example: "2025-01-01"
   *     responses:
   *       201:
   *         description: Country created successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: Country code already exists
   */
  static async createCountry(req: Request, res: Response) {
    try {
      const data: CreateCountryRequest = req.body;
      
      // Validate request data
      CountryService.validateCountryData(data);
      
      const country = await CountryService.createCountry(data);
      
      return ResponseHelper.created(res, 'Country created successfully', country);
    } catch (error: any) {
      logger.error(`Error in createCountry: ${error.message}`);
      
      if (error.message.includes('already exists')) {
        return ResponseHelper.conflict(res, error.message);
      }
      
      if (error.message.includes('Validation failed')) {
        return ResponseHelper.badRequest(res, error.message);
      }
      
      return ResponseHelper.error(res, 'Failed to create country', error);
    }
  }

  /**
   * @swagger
   * /countries:
   *   get:
   *     summary: Get all countries with filtering and pagination
   *     tags: [Countries]
   *     parameters:
   *       - in: query
   *         name: is_active
   *         schema:
   *           type: boolean
   *         description: Filter by active status
   *       - in: query
   *         name: currency_code
   *         schema:
   *           type: string
   *         description: Filter by currency code
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search in name, local_name, or codes
   *       - in: query
   *         name: languages
   *         schema:
   *           type: string
   *         description: Filter by supported language
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Number of countries to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of countries to skip
   *       - in: query
   *         name: sort_by
   *         schema:
   *           type: string
   *           enum: [name, code, created_at, launch_date]
   *           default: name
   *         description: Field to sort by
   *       - in: query
   *         name: sort_order
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *         description: Sort order
   *     responses:
   *       200:
   *         description: Countries retrieved successfully
   */
  static async getCountries(req: Request, res: Response) {
    try {
      const filters: CountryFilters = {
        is_active: req.query.is_active ? req.query.is_active === 'true' : undefined,
        currency_code: req.query.currency_code as string,
        search: req.query.search as string,
        languages: req.query.languages as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
        sort_by: req.query.sort_by as any,
        sort_order: req.query.sort_order as any
      };

      const result = await CountryService.getCountries(filters);
      
      return ResponseHelper.success(res, 'Countries retrieved successfully', result.countries, 200, result.meta);
    } catch (error: any) {
      logger.error(`Error in getCountries: ${error.message}`);
      return ResponseHelper.error(res, 'Failed to retrieve countries', error);
    }
  }

  /**
   * @swagger
   * /countries/{id}:
   *   get:
   *     summary: Get country by ID
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Country ID
   *     responses:
   *       200:
   *         description: Country retrieved successfully
   *       404:
   *         description: Country not found
   */
  static async getCountryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const country = await CountryService.getCountryById(id);
      
      return ResponseHelper.success(res, 'Country retrieved successfully', country);
    } catch (error: any) {
      logger.error(`Error in getCountryById: ${error.message}`);
      
      if (error.message === 'Country not found') {
        return ResponseHelper.notFound(res, 'Country not found');
      }
      
      return ResponseHelper.error(res, 'Failed to retrieve country', error);
    }
  }

  /**
   * @swagger
   * /countries/code/{code}:
   *   get:
   *     summary: Get country by code
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: code
   *         required: true
   *         schema:
   *           type: string
   *         description: Country code (ISO 3166-1 alpha-2)
   *         example: "RW"
   *     responses:
   *       200:
   *         description: Country retrieved successfully
   *       404:
   *         description: Country not found
   */
  static async getCountryByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const country = await CountryService.getCountryByCode(code);
      
      return ResponseHelper.success(res, 'Country retrieved successfully', country);
    } catch (error: any) {
      logger.error(`Error in getCountryByCode: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return ResponseHelper.notFound(res, error.message);
      }
      
      return ResponseHelper.error(res, 'Failed to retrieve country', error);
    }
  }

  /**
   * @swagger
   * /countries/{id}:
   *   put:
   *     summary: Update country
   *     tags: [Countries]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Country ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *                 example: "RW"
   *               code_alpha3:
   *                 type: string
   *                 example: "RWA"
   *               name:
   *                 type: string
   *                 example: "Rwanda"
   *               local_name:
   *                 type: string
   *                 example: "Rwanda"
   *               currency_code:
   *                 type: string
   *                 example: "RWF"
   *               currency_symbol:
   *                 type: string
   *                 example: "FRw"
   *               phone_prefix:
   *                 type: string
   *                 example: "+250"
   *               timezone:
   *                 type: string
   *                 example: "Africa/Kigali"
   *               languages:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["rw", "en", "fr"]
   *               is_active:
   *                 type: boolean
   *                 example: true
   *               launch_date:
   *                 type: string
   *                 format: date
   *                 example: "2025-01-01"
   *     responses:
   *       200:
   *         description: Country updated successfully
   *       404:
   *         description: Country not found
   *       409:
   *         description: Country code already exists
   */
  static async updateCountry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateCountryRequest = req.body;
      
      // Validate request data
      CountryService.validateCountryData(data);
      
      const country = await CountryService.updateCountry(id, data);
      
      return ResponseHelper.success(res, 'Country updated successfully', country);
    } catch (error: any) {
      logger.error(`Error in updateCountry: ${error.message}`);
      
      if (error.message === 'Country not found') {
        return ResponseHelper.notFound(res, 'Country not found');
      }
      
      if (error.message.includes('already exists')) {
        return ResponseHelper.conflict(res, error.message);
      }
      
      if (error.message.includes('Validation failed')) {
        return ResponseHelper.badRequest(res, error.message);
      }
      
      return ResponseHelper.error(res, 'Failed to update country', error);
    }
  }

  /**
   * @swagger
   * /countries/{id}:
   *   delete:
   *     summary: Delete country (soft delete)
   *     tags: [Countries]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Country ID
   *     responses:
   *       200:
   *         description: Country deleted successfully
   *       404:
   *         description: Country not found
   */
  static async deleteCountry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CountryService.deleteCountry(id);
      
      return ResponseHelper.success(res, 'Country deleted successfully');
    } catch (error: any) {
      logger.error(`Error in deleteCountry: ${error.message}`);
      
      if (error.message === 'Country not found') {
        return ResponseHelper.notFound(res, 'Country not found');
      }
      
      return ResponseHelper.error(res, 'Failed to delete country', error);
    }
  }

  /**
   * @swagger
   * /countries/{id}/hard-delete:
   *   delete:
   *     summary: Permanently delete country
   *     tags: [Countries]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Country ID
   *     responses:
   *       200:
   *         description: Country permanently deleted
   *       404:
   *         description: Country not found
   */
  static async hardDeleteCountry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CountryService.hardDeleteCountry(id);
      
      return ResponseHelper.success(res, 'Country permanently deleted');
    } catch (error: any) {
      logger.error(`Error in hardDeleteCountry: ${error.message}`);
      
      if (error.message === 'Country not found') {
        return ResponseHelper.notFound(res, 'Country not found');
      }
      
      return ResponseHelper.error(res, 'Failed to permanently delete country', error);
    }
  }

  /**
   * @swagger
   * /countries/active:
   *   get:
   *     summary: Get all active countries
   *     tags: [Countries]
   *     responses:
   *       200:
   *         description: Active countries retrieved successfully
   */
  static async getActiveCountries(_req: Request, res: Response) {
    try {
      const countries = await CountryService.getActiveCountries();
      
      return ResponseHelper.success(res, 'Active countries retrieved successfully', countries);
    } catch (error: any) {
      logger.error(`Error in getActiveCountries: ${error.message}`);
      return ResponseHelper.error(res, 'Failed to retrieve active countries', error);
    }
  }

  /**
   * @swagger
   * /countries/currency/{currency_code}:
   *   get:
   *     summary: Get countries by currency
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: currency_code
   *         required: true
   *         schema:
   *           type: string
   *         description: Currency code (ISO 4217)
   *         example: "RWF"
   *     responses:
   *       200:
   *         description: Countries retrieved successfully
   */
  static async getCountriesByCurrency(req: Request, res: Response) {
    try {
      const { currency_code } = req.params;
      const countries = await CountryService.getCountriesByCurrency(currency_code);
      
      return ResponseHelper.success(res, `Countries with currency ${currency_code} retrieved successfully`, countries);
    } catch (error: any) {
      logger.error(`Error in getCountriesByCurrency: ${error.message}`);
      return ResponseHelper.error(res, 'Failed to retrieve countries by currency', error);
    }
  }

  /**
   * @swagger
   * /countries/language/{language}:
   *   get:
   *     summary: Get countries by language
   *     tags: [Countries]
   *     parameters:
   *       - in: path
   *         name: language
   *         required: true
   *         schema:
   *           type: string
   *         description: Language code
   *         example: "en"
   *     responses:
   *       200:
   *         description: Countries retrieved successfully
   */
  static async getCountriesByLanguage(req: Request, res: Response) {
    try {
      const { language } = req.params;
      const countries = await CountryService.getCountriesByLanguage(language);
      
      return ResponseHelper.success(res, `Countries supporting ${language} retrieved successfully`, countries);
    } catch (error: any) {
      logger.error(`Error in getCountriesByLanguage: ${error.message}`);
      return ResponseHelper.error(res, 'Failed to retrieve countries by language', error);
    }
  }

  /**
   * @swagger
   * /countries/{id}/toggle-status:
   *   patch:
   *     summary: Toggle country active status
   *     tags: [Countries]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Country ID
   *     responses:
   *       200:
   *         description: Country status toggled successfully
   *       404:
   *         description: Country not found
   */
  static async toggleCountryStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const country = await CountryService.toggleCountryStatus(id);
      
      return ResponseHelper.success(res, 'Country status toggled successfully', country);
    } catch (error: any) {
      logger.error(`Error in toggleCountryStatus: ${error.message}`);
      
      if (error.message === 'Country not found') {
        return ResponseHelper.notFound(res, 'Country not found');
      }
      
      return ResponseHelper.error(res, 'Failed to toggle country status', error);
    }
  }

  /**
   * @swagger
   * /countries/stats:
   *   get:
   *     summary: Get country statistics
   *     tags: [Countries]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Country statistics retrieved successfully
   */
  static async getCountryStats(_req: Request, res: Response) {
    try {
      const stats = await CountryService.getCountryStats();
      
      return ResponseHelper.success(res, 'Country statistics retrieved successfully', stats);
    } catch (error: any) {
      logger.error(`Error in getCountryStats: ${error.message}`);
      return ResponseHelper.error(res, 'Failed to retrieve country statistics', error);
    }
  }

  /**
   * @swagger
   * /countries/search:
   *   get:
   *     summary: Search countries
   *     tags: [Countries]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search term
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of results to return
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *       400:
   *         description: Search term is required
   */
  static async searchCountries(req: Request, res: Response) {
    try {
      const { q: searchTerm, limit } = req.query;
      
      if (!searchTerm) {
        return ResponseHelper.badRequest(res, 'Search term is required');
      }
      
      const countries = await CountryService.searchCountries(
        searchTerm as string, 
        limit ? parseInt(limit as string) : undefined
      );
      
      return ResponseHelper.success(res, 'Search results retrieved successfully', countries);
    } catch (error: any) {
      logger.error(`Error in searchCountries: ${error.message}`);
      return ResponseHelper.error(res, 'Failed to search countries', error);
    }
  }
}
