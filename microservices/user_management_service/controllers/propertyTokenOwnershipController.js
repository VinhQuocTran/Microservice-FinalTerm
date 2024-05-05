const factory = require('./handlerFactory');
const PropertyTokenOwnership = require('../models/PropertyTokenOwnership');
const ListingProperty = require('../models/ListingProperty');
const cron = require('node-cron');
const axios = require('axios');
const getPropertyTokenOwnershipByUserIdAndTokenId = async (req, res) => {

  try {
    const propertyTokenOwnership = await PropertyTokenOwnership.findOne({
      where: {
        accountId: req.params.userId,
        listingPropertyId: req.params.tokenId,
      }
    });
    res.status(200).json({
      status: 'success',
      data: {
        propertyTokenOwnership,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

}
const getPropertyTokenOwnershipByUserId = async (req, res) => {

  try {
    const propertyTokenOwnership = await PropertyTokenOwnership.findAll({
      where: {
        accountId: req.params.userId
      }
    });
    res.status(200).json({
      status: 'success',
      data: {
        propertyTokenOwnership,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

}

async function getPaymentDailyRent() {
  try {
    const allPropertyTokenOwnership = await PropertyTokenOwnership.findAll();
    for (const popertyTokenOwnership of allPropertyTokenOwnership) {
      let listingProperty = await ListingProperty.findOne({
        where: {
          id: popertyTokenOwnership.listingPropertyId
        }
      })
      
      url = `http://127.0.0.1:3002/api/transactions/${popertyTokenOwnership.accountId}`
      const monthlyRent = listingProperty.monthlyRent;
      const roundedDailyRent = parseFloat((monthlyRent / 30.0).toFixed(2));
      console.log("Daily rent:", roundedDailyRent);

      data = {
        "income_amount": roundedDailyRent  
      }
      await axios.post(url, data).then(response => {
        console.log("Response:", response.status);
        if (response.status === 200) {
            console.log("Transaction created successfully");
        } else {
            console.log("Error:", response.data);
        }
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
    }
    return { message: 'Payment for daily rent processed successfully.' };
  } catch (error) {
    return { error: error.message };
  }
}

// Schedule the task to run every 45 seconds
function startPaymentDailyRentTask(getPaymentDailyRent) {
  cron.schedule('*/45 * * * * *', async () => {
    console.log('Running rent payment task every 30 seconds...');
    try {
      await getPaymentDailyRent();
      console.log('Rent payment task completed successfully.');
    } catch (error) {
      console.error('Error in rent payment task:', error);
    }
  });
}


module.exports = {
  getAllPropertyTokenOwnerShips: factory.getAll(PropertyTokenOwnership),
  getPropertyTokenOwnership: factory.getOne(PropertyTokenOwnership),
  createPropertyTokenOwnership: factory.createOne(PropertyTokenOwnership),
  updatePropertyTokenOwnership: factory.updateOne(PropertyTokenOwnership),
  deletePropertyTokenOwnership: factory.deleteOne(PropertyTokenOwnership),
  getPropertyTokenOwnershipByUserIdAndTokenId,
  getPropertyTokenOwnershipByUserId,
  getPaymentDailyRent,
  startPaymentDailyRentTask
};