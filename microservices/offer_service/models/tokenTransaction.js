// Import Sequelize and connection
const {DataTypes} = require('sequelize');
const sequelize = require('../database/connection');

// Define the Offer model
const TokenTransaction = sequelize.define('token_transactions', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    seller_token_offer_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    buyer_token_offer_id: {
        type: DataTypes.STRING,
        allowNull: false
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
(async () => {
  try {
      // Sync models with the database without forcing table recreation
      await sequelize.sync(); 
      console.log('Database synchronized');
  } catch (error) {
      console.error('Error synchronizing database:', error);
  }
})();
// Export the Offer model
module.exports = TokenTransaction;
