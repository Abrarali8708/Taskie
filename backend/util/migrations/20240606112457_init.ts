import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('users',table=>{
        table.increments("id").primary().unique();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.boolean('isAdmin').defaultTo(false).notNullable();
        table.string('companyName').notNullable();
    })
    .createTable('tasks',table=>{
        table.increments('id').primary().unique();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.datetime('startDate').notNullable();
        table.datetime('dueDate').notNullable();
        table.datetime('completionDate').defaultTo(null);
        table.integer('userId').unsigned().references('id').inTable('users').notNullable();
        table.integer('adminId').unsigned().references('id').inTable('users').notNullable();
        table.boolean('status').defaultTo(false).notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
  .dropTableIfExists('tasks')
  .dropTableIfExists('users');
}

