import type { Knex } from "knex";
const { knexSnakeCaseMappers } = require("objection");
import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    ...knexSnakeCaseMappers(),
  }

};

module.exports = config;
