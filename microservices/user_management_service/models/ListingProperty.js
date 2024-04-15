const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Service = require("../models/Service");
const SubmitProperty = require("../models/SubmitProperty");

const ListingProperty = sequelize.define(
  "",
  {
    propertyValuation: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    monthlyRent: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    tokenSupply: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tokenPrice: {
      type: DataTypes.DOUBLE,
      defaultValue: 50,
    },
    submitPropertyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    serviceId: {
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
    tableName: "listing_property",
    timestamps: true,
    underscored: true,
  }
);

// Associates
ListingProperty.belongsTo(SubmitProperty, { foreignKey: "submitPropertyId" });
ListingProperty.belongsTo(Service, { foreignKey: "serviceId" });

// Hooks
ListingProperty.addHook("beforeCreate", async (listingProperty, options) => {
  // Generate a custom ID like "LP_0001", "LP_0002", ...
  const latestListingProperty = await ListingProperty.findOne({
    order: [["id", "DESC"]],
    attributes: ["id"],
  });

  let counter = 1;
  if (latestListingProperty) {
    const lastListingPropertyId = parseInt(latestListingProperty.id.split("_")[1], 10);
    counter = lastListingPropertyId + 1;
  }

  const listingPropertyId = `LP_${counter.toString().padStart(4, "0")}`;
  listingProperty.id = listingPropertyId;
});

module.exports = ListingProperty;
