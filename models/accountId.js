"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const process = require('process');
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const AccountIds = sequelize.define(
    "accountIds",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      team: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      account_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      }
    },
    {
      timestamps: true,
    }
  );

module.exports = AccountIds;