import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product_images', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    table.text('image_url').notNullable();
    table.text('thumbnail_url');
    table.string('alt_text', 255);
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_primary').defaultTo(false);
    table.jsonb('ai_analysis');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_images');
}
