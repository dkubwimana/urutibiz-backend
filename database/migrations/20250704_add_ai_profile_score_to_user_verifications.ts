import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_verifications', (table) => {
    table.float('ai_profile_score').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_verifications', (table) => {
    table.dropColumn('ai_profile_score');
  });
}
