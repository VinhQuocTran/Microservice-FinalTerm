const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const ListingProperty = require("../models/ListingProperty");
const Account = require("../models/Account");

const PropertyTokenOwnership = sequelize.define(
  "",
  {
    ownNumber: {
      type: DataTypes.DOUBLE,
    },
    listingPropertyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "property_token_ownership",
    timestamps: true,
    underscored: true,
  }
);

// Associates
PropertyTokenOwnership.belongsTo(ListingProperty, { foreignKey: "listingPropertyId" });
PropertyTokenOwnership.belongsTo(Account, { foreignKey: "accountId" });

// Hooks
PropertyTokenOwnership.addHook("beforeCreate", async (propertyTokenOwnership, options) => {
  // Generate a custom ID like "PTO_0001", "PTO_0002", ...
  const latestPropertyTokenOwnerShip = await PropertyTokenOwnership.findOne({
    order: [["id", "DESC"]],
    attributes: ["id"],
  });

  let counter = 1;
  if (latestPropertyTokenOwnerShip) {
    const lastPropertyTokenOwnershipId = parseInt(latestPropertyTokenOwnerShip.id.split("_")[1], 10);
    counter = lastPropertyTokenOwnershipId + 1;
  }

  const propertyTokenOwnershipId = `PTO_${counter.toString().padStart(4, "0")}`;
  propertyTokenOwnership.id = propertyTokenOwnershipId;
});

module.exports = PropertyTokenOwnership;
