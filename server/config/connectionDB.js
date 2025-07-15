const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('users', 'root', 'Akhilesh@1996', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,    // optional: disable SQL logs in console
});

module.exports = sequelize;
