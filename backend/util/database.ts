const {Model} =require('objection');
const knex =require('knex');
const knexfile = require('./knexfile');
import dotenv from 'dotenv';
dotenv.config();

function db(){
    Model.knex(knex(knexfile.development));
}

export default db;