"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const config = require('./config');
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const SubDomainHistory = sequelize.define(
    "subdomainHistory",
    {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false, // This will store the type of the DNS record (e.g., "A", "CNAME", etc.)
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ipv4_only: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      ipv6_only: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      ttl: {
        type: DataTypes.INTEGER,
        allowNull: true, // Time to live (TTL) for the DNS record
        defaultValue: 3600, // You can set default TTL as 3600 if you want
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      server_ip: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      account_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      zone_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      dns_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    
    {
      tableName: "subdomainHistory",
      timestamps: false,
    }
  );

module.exports = SubDomainHistory;
