'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("service", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      name: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
      },
      address: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
      },
      phoneNumber: {
        field: 'phone_number',
        type: Sequelize.DataTypes.STRING(16),
        allowNull: false,
      },
      feePerTime: {
        field: 'fee_per_time',
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      serviceType: {
        field: 'service_type',
        type: Sequelize.DataTypes.ENUM('ST01', 'ST02', 'ST03', 'ST04'),
        allowNull: false,
      },
      createdAt: {
        field:  'created_at',
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DataTypes.DATE
      }      
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('service');
  }
};
