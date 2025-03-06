"use strict";
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
require('dotenv').config();
const config = require('./config');
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

const SubDomains = sequelize.define(
    "subdomains",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      domain: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      proxied: {
        type: DataTypes.BOOLEAN,
        allowNull: true, // This is for 'proxied' field in your JSON
        defaultValue: false,
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
      tags: {
        type: DataTypes.JSON, // Store tags as a JSON array (e.g., ["owner:dns-team"])
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false, // This will store the type of the DNS record (e.g., "A", "CNAME", etc.)
      },
      proxiable: {
        type: DataTypes.BOOLEAN,
        allowNull: true, // To handle the 'proxiable' field
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      domain: {
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
      timestamps: true,
    }
  );

module.exports = SubDomains;
