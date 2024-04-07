const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const SubmitProperty = require("../models/SubmitProperty");
const Service = require("../models/Service");

const PropertyServiceTransaction = sequelize.define(
  "",
  {
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    submitPropertyId: {
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
    tableName: "property_service_transaction",
    timestamps: true,
    underscored: true,
  }
);

// Associates
PropertyServiceTransaction.belongsTo(SubmitProperty, { foreignKey: "submitPropertyId" });
PropertyServiceTransaction.belongsTo(Service, { foreignKey: "serviceId" });

// Hooks
PropertyServiceTransaction.addHook("beforeCreate", async (propertyServiceTransaction, options) => {
  // Generate a custom ID like "PST_0001", "PST_0002", ...
  const latestProperty = await PropertyServiceTransaction.findOne({
    order: [["id", "DESC"]],
    attributes: ["id"],
  });

  let counter = 1;
  if (latestProperty) {
    const lastPropertyId = parseInt(latestProperty.id.split("_")[1], 10);
    counter = lastPropertyId + 1;
  }

  const propertyServiceTransactionId = `PST_${counter.toString().padStart(4, "0")}`;
  propertyServiceTransaction.id = propertyServiceTransactionId;
});

module.exports = PropertyServiceTransaction;
