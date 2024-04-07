const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Service = sequelize.define(
  "",
  {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    feePerTime: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM("ST01", "ST02", "ST03", "ST04"),
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
    tableName: "service",
    timestamps: true,
    underscored: true,
  }
);

// Hooks
Service.addHook(
  "beforeCreate",
  async (service, options) => {
    // Generate a custom ID like "SERVICE_0001", "SERVICE_0002", ...
    const latestProperty = await Service.findOne({
      order: [["id", "DESC"]],
      attributes: ["id"],
    });

    let counter = 1;
    if (latestProperty) {
      const lastPropertyId = parseInt(latestProperty.id.split("_")[1], 10);
      counter = lastPropertyId + 1;
    }

    const serviceId = `SERVICE_${counter
      .toString()
      .padStart(4, "0")}`;
    service.id = serviceId;
  }
);

module.exports = Service;
