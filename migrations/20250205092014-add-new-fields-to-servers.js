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
    // Add new fields 'username' and 'authMethod' to the 'servers' table
    await queryInterface.addColumn('servers', 'username', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('servers', 'authMethod', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('servers', 'username');
    await queryInterface.removeColumn('servers', 'authMethod');
  }
};
