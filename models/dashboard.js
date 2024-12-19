"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const process = require('process');
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const Dashboards = sequelize.define(
    "dashboards",
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
      server_ip: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      sites: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = Dashboards;