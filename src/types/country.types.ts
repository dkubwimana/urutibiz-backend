// =====================================================
// COUNTRY TYPES
// =====================================================

export interface Country {
  id: string;
  code: string; // ISO 3166-1 alpha-2 (RW, KE, UG, etc.)
  code_alpha3: string; // ISO 3166-1 alpha-3 (RWA, KEN, UGA)
  name: string;
  local_name?: string; // Local language name
  currency_code: string; // ISO 4217 (RWF, KES, UGX, USD)
  currency_symbol?: string;
  phone_prefix?: string; // +250, +254, +256
  timezone?: string; // Africa/Kigali, Africa/Nairobi
  languages: string[]; // Supported languages
  is_active: boolean;
  launch_date?: string | Date | null; // When UrutiBiz launched in this country
  created_at: Date;
  updated_at?: Date;
}

export interface CreateCountryRequest {
  code: string;
  code_alpha3: string;
  name: string;
  local_name?: string;
  currency_code: string;
  currency_symbol?: string;
  phone_prefix?: string;
  timezone?: string;
  languages?: string[];
  is_active?: boolean;
  launch_date?: string | Date | null;
}

export interface UpdateCountryRequest {
  code?: string;
  code_alpha3?: string;
  name?: string;
  local_name?: string;
  currency_code?: string;
  currency_symbol?: string;
  phone_prefix?: string;
  timezone?: string;
  languages?: string[];
  is_active?: boolean;
  launch_date?: string | Date | null;
}

export interface CountryFilters {
  is_active?: boolean;
  currency_code?: string;
  search?: string; // Search in name, local_name, code
  languages?: string; // Filter by supported language
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'code' | 'created_at' | 'launch_date';
  sort_order?: 'asc' | 'desc';
}

export interface CountryStats {
  total_countries: number;
  active_countries: number;
  inactive_countries: number;
  countries_by_currency: Record<string, number>;
  countries_by_region: Record<string, number>;
  recent_launches: Country[];
}

export interface CountryResponse {
  success: boolean;
  message: string;
  data?: Country | Country[] | CountryStats;
  meta?: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
  };
}

// Commonly used country codes
export const COUNTRY_CODES = {
  RWANDA: 'RW',
  KENYA: 'KE',
  UGANDA: 'UG',
  TANZANIA: 'TZ',
  UNITED_STATES: 'US',
  UNITED_KINGDOM: 'GB',
  CANADA: 'CA'
} as const;

// Common currency codes
export const CURRENCY_CODES = {
  RWF: 'RWF', // Rwandan Franc
  KES: 'KES', // Kenyan Shilling
  UGX: 'UGX', // Ugandan Shilling
  TZS: 'TZS', // Tanzanian Shilling
  USD: 'USD', // US Dollar
  EUR: 'EUR', // Euro
  GBP: 'GBP'  // British Pound
} as const;

// Common timezones
export const TIMEZONES = {
  KIGALI: 'Africa/Kigali',
  NAIROBI: 'Africa/Nairobi',
  KAMPALA: 'Africa/Kampala',
  DAR_ES_SALAAM: 'Africa/Dar_es_Salaam',
  NEW_YORK: 'America/New_York',
  LONDON: 'Europe/London'
} as const;
