const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createPool({
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPassword,
  database: config.mysqlDB,
});

module.exports = connection;
