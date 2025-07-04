import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 255).notNullable();
    table.text('description');
    table.uuid('category_id').references('id').inTable('categories').onDelete('SET NULL');
    table.decimal('price', 12, 2).notNullable();
    table.string('currency', 10).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.integer('stock').defaultTo(0);
    table.text('image_url');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
}
