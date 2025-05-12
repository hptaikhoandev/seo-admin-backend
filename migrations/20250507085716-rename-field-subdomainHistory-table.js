'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('subdomainHistory', 'domain', 'name');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('subdomainHistory', 'name', 'domain');
  }
};
