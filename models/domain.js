"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const config = require('./config');
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const Domains = sequelize.define(
    "domains",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ns: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
    },
    {
      timestamps: true,
    }
  );

module.exports = Domains;
