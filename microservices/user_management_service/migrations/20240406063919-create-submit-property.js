'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("submit_property", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      result: {
        type: Sequelize.DataTypes.ENUM('-1', '0', '1'),
        defaultValue: null,
      },
      note: {
        type: Sequelize.DataTypes.STRING(128),        
      },
      submitType: {
        field: 'submit_type',
        type: Sequelize.DataTypes.ENUM('verification', 'listing'),
        allowNull: false,
      },
      fee: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false
      },
      propertyId: {
        field: 'property_id',
        type: Sequelize.DataTypes.UUID,
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
    await queryInterface.dropTable('submit_property');
  }
};
