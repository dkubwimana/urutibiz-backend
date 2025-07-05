// =====================================================
// COUNTRY MODEL
// =====================================================

import { getDatabase } from '@/config/database';
import { Country, CreateCountryRequest, UpdateCountryRequest, CountryFilters, CountryStats } from '@/types/country.types';
import { v4 as uuidv4 } from 'uuid';

export class CountryModel {
  
  /**
   * Create a new country
   */
  static async create(data: CreateCountryRequest): Promise<Country> {
    const db = getDatabase();
    
    const countryData = {
      id: uuidv4(),
      ...data,
      languages: data.languages || ['en'],
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date(),
      updated_at: new Date()
    };

    const [country] = await db('countries')
      .insert(countryData)
      .returning('*');

    return country;
  }

  /**
   * Get country by ID
   */
  static async findById(id: string): Promise<Country | null> {
    const db = getDatabase();
    
    const country = await db('countries')
      .where({ id })
      .first();

    return country || null;
  }

  /**
   * Get country by code (ISO 3166-1 alpha-2)
   */
  static async findByCode(code: string): Promise<Country | null> {
    const db = getDatabase();
    
    const country = await db('countries')
      .where({ code: code.toUpperCase() })
      .first();

    return country || null;
  }

  /**
   * Get country by alpha-3 code
   */
  static async findByAlpha3Code(code_alpha3: string): Promise<Country | null> {
    const db = getDatabase();
    
    const country = await db('countries')
      .where({ code_alpha3: code_alpha3.toUpperCase() })
      .first();

    return country || null;
  }

  /**
   * Get all countries with filters
   */
  static async findAll(filters: CountryFilters = {}): Promise<{ countries: Country[]; total: number }> {
    const db = getDatabase();
    
    let query = db('countries');

    // Apply filters
    if (filters.is_active !== undefined) {
      query = query.where({ is_active: filters.is_active });
    }

    if (filters.currency_code) {
      query = query.where({ currency_code: filters.currency_code.toUpperCase() });
    }

    if (filters.languages) {
      query = query.whereRaw('? = ANY(languages)', [filters.languages]);
    }

    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      query = query.where(function() {
        this.whereRaw('LOWER(name) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(local_name) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(code) LIKE ?', [searchTerm])
            .orWhereRaw('LOWER(code_alpha3) LIKE ?', [searchTerm]);
      });
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');
    const total = parseInt(count as string);

    // Apply sorting
    const sortBy = filters.sort_by || 'name';
    const sortOrder = filters.sort_order || 'asc';
    query = query.orderBy(sortBy, sortOrder);

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const countries = await query;

    return { countries, total };
  }

  /**
   * Update country by ID
   */
  static async update(id: string, data: UpdateCountryRequest): Promise<Country | null> {
    const db = getDatabase();
    
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if ((updateData as any)[key] === undefined) {
        delete (updateData as any)[key];
      }
    });

    const [country] = await db('countries')
      .where({ id })
      .update(updateData)
      .returning('*');

    return country || null;
  }

  /**
   * Delete country by ID (soft delete by setting is_active to false)
   */
  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    
    const [country] = await db('countries')
      .where({ id })
      .update({ 
        is_active: false,
        updated_at: new Date()
      })
      .returning('*');

    return !!country;
  }

  /**
   * Hard delete country by ID
   */
  static async hardDelete(id: string): Promise<boolean> {
    const db = getDatabase();
    
    const deletedCount = await db('countries')
      .where({ id })
      .del();

    return deletedCount > 0;
  }

  /**
   * Get active countries only
   */
  static async findActive(): Promise<Country[]> {
    const { countries } = await this.findAll({ is_active: true });
    return countries;
  }

  /**
   * Get countries by currency
   */
  static async findByCurrency(currency_code: string): Promise<Country[]> {
    const { countries } = await this.findAll({ 
      currency_code: currency_code.toUpperCase(),
      is_active: true 
    });
    return countries;
  }

  /**
   * Get countries that support a specific language
   */
  static async findByLanguage(language: string): Promise<Country[]> {
    const { countries } = await this.findAll({ 
      languages: language.toLowerCase(),
      is_active: true 
    });
    return countries;
  }

  /**
   * Get country statistics
   */
  static async getStats(): Promise<CountryStats> {
    const db = getDatabase();
    
    // Total counts
    const [totalResult] = await db('countries').count('* as count');
    const [activeResult] = await db('countries').where({ is_active: true }).count('* as count');
    const [inactiveResult] = await db('countries').where({ is_active: false }).count('* as count');

    const total_countries = parseInt(totalResult.count as string);
    const active_countries = parseInt(activeResult.count as string);
    const inactive_countries = parseInt(inactiveResult.count as string);

    // Countries by currency
    const currencyStats = await db('countries')
      .select('currency_code')
      .count('* as count')
      .where({ is_active: true })
      .groupBy('currency_code');

    const countries_by_currency: Record<string, number> = {};
    currencyStats.forEach(stat => {
      countries_by_currency[stat.currency_code] = parseInt(stat.count as string);
    });

    // Countries by timezone (as region indicator)
    const timezoneStats = await db('countries')
      .select('timezone')
      .count('* as count')
      .where({ is_active: true })
      .whereNotNull('timezone')
      .groupBy('timezone');

    const countries_by_region: Record<string, number> = {};
    timezoneStats.forEach(stat => {
      const region = String(stat.timezone).split('/')[0]; // Extract continent
      countries_by_region[region] = (countries_by_region[region] || 0) + parseInt(stat.count as string);
    });

    // Recent launches (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recent_launches = await db('countries')
      .where('launch_date', '>=', sixMonthsAgo.toISOString().split('T')[0])
      .whereNotNull('launch_date')
      .orderBy('launch_date', 'desc')
      .limit(5);

    return {
      total_countries,
      active_countries,
      inactive_countries,
      countries_by_currency,
      countries_by_region,
      recent_launches
    };
  }

  /**
   * Check if country code exists
   */
  static async codeExists(code: string, excludeId?: string): Promise<boolean> {
    const db = getDatabase();
    
    let query = db('countries').where({ code: code.toUpperCase() });
    
    if (excludeId) {
      query = query.whereNot({ id: excludeId });
    }

    const country = await query.first();
    return !!country;
  }

  /**
   * Check if alpha-3 code exists
   */
  static async alpha3CodeExists(code_alpha3: string, excludeId?: string): Promise<boolean> {
    const db = getDatabase();
    
    let query = db('countries').where({ code_alpha3: code_alpha3.toUpperCase() });
    
    if (excludeId) {
      query = query.whereNot({ id: excludeId });
    }

    const country = await query.first();
    return !!country;
  }

  /**
   * Activate/Deactivate country
   */
  static async toggleActive(id: string): Promise<Country | null> {
    const db = getDatabase();
    
    const country = await this.findById(id);
    if (!country) return null;

    const [updatedCountry] = await db('countries')
      .where({ id })
      .update({ 
        is_active: !country.is_active,
        updated_at: new Date()
      })
      .returning('*');

    return updatedCountry || null;
  }
}
