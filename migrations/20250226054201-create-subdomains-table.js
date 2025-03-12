'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('subdomains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      domain: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      comment: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      content: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      proxied: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      ipv4_only: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      ipv6_only: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      ttl: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 3600,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      proxiable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      userId: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_on: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      modified_on: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      domain: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      server_ip: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      account_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      zone_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      dns_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('subdomains');
  }
};
