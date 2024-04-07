const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Service = require("../models/Service");
const ListingProperty = require("../models/ListingProperty");

const MonthlyPropertyValuation = sequelize.define(
  "",
  {
    valuationAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    listingPropertyId: {
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
    tableName: "monthly_property_valuation",
    timestamps: true,
    underscored: true,
  }
);

// Associates
MonthlyPropertyValuation.belongsTo(ListingProperty, { foreignKey: "listingPropertyId" });
MonthlyPropertyValuation.belongsTo(Service, { foreignKey: "serviceId" });

// Hooks
MonthlyPropertyValuation.addHook("beforeCreate", async (monthlyPropertyValuation, options) => {
  // Generate a custom ID like "MPV_0001", "MPV_0002", ...
  const latestProperty = await Service.findOne({
    order: [["id", "DESC"]],
    attributes: ["id"],
  });

  let counter = 1;
  if (latestProperty) {
    const lastPropertyId = parseInt(latestProperty.id.split("_")[1], 10);
    counter = lastPropertyId + 1;
  }

  const monthlyPropertyValuationId = `MPV_${counter.toString().padStart(4, "0")}`;
  monthlyPropertyValuation.id = monthlyPropertyValuationId;
});

module.exports = MonthlyPropertyValuation;
