"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const process = require('process');
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const UserRoles = sequelize.define(
  "user_roles",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserRoles;
