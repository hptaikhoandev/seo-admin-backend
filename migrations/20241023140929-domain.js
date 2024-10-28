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

    await queryInterface.createTable('domains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ns: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

    // Thêm khóa ngoại cho trường userId
    await queryInterface.addConstraint('domains', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_domains_userId', // Tên của constraint, tùy ý bạn
      references: {
        table: 'users', // Tên bảng mà userId tham chiếu đến
        field: 'id' // Tên cột mà userId tham chiếu đến
      },
      onDelete: 'cascade', // Hành động khi bản ghi trong bảng cha bị xóa
      onUpdate: 'cascade' // Hành động khi bản ghi trong bảng cha bị cập nhật
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('domains', 'fk_domains_userId')
    await queryInterface.dropTable('domains')
  }
};
