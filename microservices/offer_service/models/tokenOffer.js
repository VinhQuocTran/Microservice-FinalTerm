// Import Sequelize and connection
const {DataTypes} = require('sequelize');
const sequelize = require('../database/connection');
const TokenTransaction = require('../models/tokenTransaction');
// Define the Offer model
const TokenOffer = sequelize.define('token_offers', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    account_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    at_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    is_buy: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});
// Define associations
TokenOffer.hasMany(TokenTransaction, { foreignKey: 'seller_token_offer_id', as: 'sellerTransactions' });
TokenOffer.hasMany(TokenTransaction, { foreignKey: 'buyer_token_offer_id', as: 'buyerTransactions' });
module.exports = TokenOffer;
