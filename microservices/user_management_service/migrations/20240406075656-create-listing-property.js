"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("listing_property", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      propertyValuation: {
        field: 'property_valuation',
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      monthlyRent: {
        field: 'monthly_rent',
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      tokenSupply: {
        field: 'token_supply',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      tokenPrice: {
        field: 'token_price',
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 50
      },
      submitPropertyId: {
        field: 'submit_property_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      serviceId: {
        field: 'service_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("listing_property");
  },
};
