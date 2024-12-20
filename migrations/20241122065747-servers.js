'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('servers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      server_ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      team: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cpu: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ram: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sites: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      key_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      private_key: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('servers');
  }
};
