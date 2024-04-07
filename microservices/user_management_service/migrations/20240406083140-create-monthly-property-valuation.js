"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("monthly_property_valuation", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      valuationAmount: {
        field: "valuation_amount",
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      serviceId: {
        field: "service_id",
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      listingPropertyId: {
        field: "listing_property_id",
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
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
    await queryInterface.dropTable("monthly_property_valuation");
  },
};
