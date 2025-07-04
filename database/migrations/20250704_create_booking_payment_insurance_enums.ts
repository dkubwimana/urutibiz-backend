import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create booking_status enum
  await knex.schema.raw(`
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')
  `);
  
  // Create payment_status enum  
  await knex.schema.raw(`
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')
  `);
  
  // Create insurance_type enum
  await knex.schema.raw(`
    CREATE TYPE insurance_type AS ENUM ('basic', 'standard', 'premium', 'none')
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop enum types in reverse order
  await knex.schema.raw(`DROP TYPE IF EXISTS insurance_type CASCADE`);
  await knex.schema.raw(`DROP TYPE IF EXISTS payment_status CASCADE`);
  await knex.schema.raw(`DROP TYPE IF EXISTS booking_status CASCADE`);
}
