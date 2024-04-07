const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Account = require('../models/Account');

const Property = sequelize.define('', {
    description: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    numOfBedroom: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numOfWc: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalFloor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    area: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    propertyImageUrl: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    propertyDocumentUrl: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.ENUM('-1', '0', '1'),
        defaultValue: '-1'
    },
    isListed: {
        type: DataTypes.ENUM('-1', '0', '1'),
        defaultValue: '-1'
    },
    propertyDistrict: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
            'Binh Thanh', 'Thu Duc', 'Go Vap', 'Phu Nhuan', 'Tan Binh', 'Tan Phu', 'Binh Tan'),
        allowNull: false,
    },
    accountId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'property',
    timestamps: true,
    underscored: true,
});

// Associates
Property.belongsTo(Account, { foreignKey: 'accountId' });

// Hooks
Property.addHook('beforeCreate', async (property, options) => {
    // Generate a custom ID like "PROPERTY_0001", "PROPERTY_0002", ...
    const latestProperty = await Property.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestProperty) {
        const lastPropertyId = parseInt(latestProperty.id.split('_')[1], 10);
        counter = lastPropertyId + 1;
    }

    const propertyId = `PROPERTY_${counter.toString().padStart(4, '0')}`;
    property.id = propertyId;
});

module.exports = Property;