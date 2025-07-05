import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable UUID extension if not already enabled
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Create countries table
  await knex.schema.createTable('countries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('code', 2).unique().notNullable().comment('ISO 3166-1 alpha-2 (RW, KE, UG, etc.)');
    table.string('code_alpha3', 3).unique().notNullable().comment('ISO 3166-1 alpha-3 (RWA, KEN, UGA)');
    table.string('name', 100).notNullable();
    table.string('local_name', 100).comment('Local language name');
    table.string('currency_code', 3).notNullable().comment('ISO 4217 (RWF, KES, UGX, USD)');
    table.string('currency_symbol', 10);
    table.string('phone_prefix', 10).comment('+250, +254, +256');
    table.string('timezone', 50).comment('Africa/Kigali, Africa/Nairobi');
    table.specificType('languages', 'VARCHAR(10)[]').defaultTo(knex.raw("ARRAY['en']")).comment('Supported languages');
    table.boolean('is_active').defaultTo(true);
    table.date('launch_date').comment('When UrutiBiz launched in this country');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());

    // Indexes for better performance
    table.index(['code']);
    table.index(['code_alpha3']);
    table.index(['is_active']);
    table.index(['currency_code']);
  });

  // Insert initial data for East African countries
  await knex('countries').insert([
    {
      code: 'RW',
      code_alpha3: 'RWA',
      name: 'Rwanda',
      local_name: 'Rwanda',
      currency_code: 'RWF',
      currency_symbol: 'FRw',
      phone_prefix: '+250',
      timezone: 'Africa/Kigali',
      languages: ['rw', 'en', 'fr'],
      is_active: true,
      launch_date: '2025-01-01'
    },
    {
      code: 'KE',
      code_alpha3: 'KEN',
      name: 'Kenya',
      local_name: 'Kenya',
      currency_code: 'KES',
      currency_symbol: 'KSh',
      phone_prefix: '+254',
      timezone: 'Africa/Nairobi',
      languages: ['sw', 'en'],
      is_active: true,
      launch_date: '2025-06-01'
    },
    {
      code: 'UG',
      code_alpha3: 'UGA',
      name: 'Uganda',
      local_name: 'Uganda',
      currency_code: 'UGX',
      currency_symbol: 'USh',
      phone_prefix: '+256',
      timezone: 'Africa/Kampala',
      languages: ['en', 'sw'],
      is_active: true,
      launch_date: '2025-09-01'
    },
    {
      code: 'TZ',
      code_alpha3: 'TZA',
      name: 'Tanzania',
      local_name: 'Tanzania',
      currency_code: 'TZS',
      currency_symbol: 'TSh',
      phone_prefix: '+255',
      timezone: 'Africa/Dar_es_Salaam',
      languages: ['sw', 'en'],
      is_active: false,
      launch_date: null
    },
    {
      code: 'US',
      code_alpha3: 'USA',
      name: 'United States',
      local_name: 'United States',
      currency_code: 'USD',
      currency_symbol: '$',
      phone_prefix: '+1',
      timezone: 'America/New_York',
      languages: ['en'],
      is_active: true,
      launch_date: '2024-01-01'
    }
  ]);

  console.log('✅ Countries table created with initial data');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('countries');
  console.log('❌ Countries table dropped');
}
