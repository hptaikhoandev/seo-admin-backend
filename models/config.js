'use strict';

require('dotenv').config();
const process = require('process');

const config = {
  "database": process.env.DB_NAME, 
  "username": process.env.DB_USERNAME, 
  "password": process.env.DB_PASSWORD,
  "host": process.env.DB_HOST,
  "dialect": process.env.DB_DIALECT || "mysql",
};


module.exports = config;  // ✅ Use CommonJS syntax
