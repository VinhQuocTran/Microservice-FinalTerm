const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Property = require("../models/Property");

const SubmitProperty = sequelize.define(
  "",
  {
    result: {
      type: DataTypes.ENUM("-1", "0", "1"),
      defaultValue: null,
    },
    note: {
      type: DataTypes.STRING(128),        
    },
    submitType: {
      type: DataTypes.ENUM('verification', 'listing'),
      allowNull: false,
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    propertyId: {
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
    tableName: "submit_property",
    timestamps: true,
    underscored: true,
  }
);

// Associates
SubmitProperty.belongsTo(Property, { foreignKey: "propertyId" });

// Hooks
SubmitProperty.addHook("beforeCreate", async (submitProperty, options) => {
  // Generate a custom ID like "SP_0001", "SP_0002", ...
  const latestProperty = await SubmitProperty.findOne({
    order: [["id", "DESC"]],
    attributes: ["id"],
  });

  let counter = 1;
  if (latestProperty) {
    const lastPropertyId = parseInt(latestProperty.id.split("_")[1], 10);
    counter = lastPropertyId + 1;
  }

  const submitPropertyId = `SP_${counter.toString().padStart(4, "0")}`;
  submitProperty.id = submitPropertyId;
});

module.exports = SubmitProperty;
