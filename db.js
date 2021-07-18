const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:dbLocal@localhost:5432/workoutlog")

module.exports = sequelize;