"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const process = require('process');
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const Pems = sequelize.define(
    "pems",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      pem: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      server_ip: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = Pems;