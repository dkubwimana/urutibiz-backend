import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Update product_status enum to include 'suspended' and 'deleted' instead of 'archived'
  await knex.schema.raw(`
    ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'suspended';
    ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'deleted';
  `);
  
  // For product_condition, we need to drop and recreate since the values are completely different
  // First check if the products table exists and has data
  const tableExists = await knex.schema.hasTable('products');
  
  if (tableExists) {
    // Drop the condition column temporarily
    await knex.schema.raw(`
      ALTER TABLE products DROP COLUMN IF EXISTS condition
    `);
  }
  
  // Drop and recreate the product_condition enum
  await knex.schema.raw(`DROP TYPE IF EXISTS product_condition CASCADE`);
  await knex.schema.raw(`CREATE TYPE product_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor')`);
  
  if (tableExists) {
    // Add the condition column back with the new enum
    await knex.schema.alterTable('products', (table) => {
      table.enu('condition', ['new', 'like_new', 'good', 'fair', 'poor'], { 
        useNative: true, 
        enumName: 'product_condition' 
      }).notNullable().defaultTo('good');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Revert product_condition enum
  const tableExists = await knex.schema.hasTable('products');
  
  if (tableExists) {
    await knex.schema.raw(`ALTER TABLE products DROP COLUMN IF EXISTS condition`);
  }
  
  await knex.schema.raw(`DROP TYPE IF EXISTS product_condition CASCADE`);
  await knex.schema.raw(`CREATE TYPE product_condition AS ENUM ('new', 'used', 'refurbished')`);
  
  if (tableExists) {
    await knex.schema.alterTable('products', (table) => {
      table.enu('condition', ['new', 'used', 'refurbished'], { 
        useNative: true, 
        enumName: 'product_condition' 
      }).notNullable().defaultTo('used');
    });
  }
  
  // Note: Cannot easily remove enum values from product_status, would need to recreate
  // For safety, leaving the additional values ('suspended', 'deleted') in place
}
