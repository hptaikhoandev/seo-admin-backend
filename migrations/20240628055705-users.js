'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
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

    // Insert initial user
    await queryInterface.bulkInsert('users', [{
      name: 'seo-admin',
      email: 'seo-admin@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'seo-1',
      email: 'seo-1@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'seo-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'seo-2',
      email: 'seo-2@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'seo-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'seo-3',
      email: 'seo-3@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'seo-3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'seo-4',
      email: 'seo-4@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'seo-4',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'seo-5',
      email: 'seo-5@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'seo-5',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'seo-6',
      email: 'seo-6@hyperpush.com',
      password: await bcrypt.hash('okebaybi', 10),
      roleId: 'seo-6',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
