"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const config = require('./config');
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
      cpu: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ram: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sites: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      key_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      authMethod: {
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