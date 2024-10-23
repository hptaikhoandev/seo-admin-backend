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
    await queryInterface.createTable('user_roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      roleId: {
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
    });

    await queryInterface.addConstraint('user_roles', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_user_roles_userId', // Tên của constraint, tùy ý bạn
      references: {
        table: 'users', // Tên bảng mà userId tham chiếu đến
        field: 'id' // Tên cột mà userId tham chiếu đến
      },
      onDelete: 'cascade', // Hành động khi bản ghi trong bảng cha bị xóa
      onUpdate: 'cascade' // Hành động khi bản ghi trong bảng cha bị cập nhật
    });

    await queryInterface.addConstraint('user_roles', {
      fields: ['roleId'],
      type: 'foreign key',
      name: 'fk_role_user_roleId', // Tên của constraint, tùy ý bạn
      references: {
        table: 'roles', // Tên bảng mà userId tham chiếu đến
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
    await queryInterface.removeConstraint('users', 'fk_user_roles_userId')
    await queryInterface.removeConstraint('roles', 'fk_role_user_roleId')
    await queryInterface.dropTable('emails')
  }
};
