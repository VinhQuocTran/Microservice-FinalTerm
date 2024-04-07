"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("property_token_ownership", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      ownNumber: {
        field: "own_number",
        type: Sequelize.DataTypes.DOUBLE,
      },
      listingPropertyId: {
        field: "listing_property_id",
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      accountId: {
        field: 'account_id',
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
    await queryInterface.dropTable("property_token_ownership");
  },
};
