'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('subdomainHistory', {
      id: {
          allowNull: true,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        domain: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        comment: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING(255),
          allowNull: false, // This will store the type of the DNS record (e.g., "A", "CNAME", etc.)
        },
        content: {
          type: Sequelize.STRING(255),
          allowNull: true,
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
          allowNull: true, // Time to live (TTL) for the DNS record
          defaultValue: 3600, // You can set default TTL as 3600 if you want
        },
        userId: {
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
        created_on: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        modified_on: {
          type: Sequelize.DATE,
          allowNull: true,
        }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('subdomainHistory');
  }
};
