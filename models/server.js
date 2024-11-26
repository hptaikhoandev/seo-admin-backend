"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const process = require('process');
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const Servers = sequelize.define(
    "servers",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      server_ip: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      team: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      key_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      private_key: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = Servers;