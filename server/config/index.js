const bcrypt = require('./bcrypt');

module.exports = {
  bcrypt,
  connections: {
    "development": {
      "username": "postgres",
      "password": null,
      "database": "customers",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": "postgres",
      "password": null,
      "database": "customers_test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": {
      "username": process.env.DB_USER,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "host": process.env.DB_HOST,
      "dialect": "postgres"
    }
  }
}
