const factory = require('./handlerFactory');
const PropertyTokenOwnership = require('../models/PropertyTokenOwnership');
const { listProperty } = require('./propertyController');

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

module.exports = {
  getAllPropertyTokenOwnerShips: factory.getAll(PropertyTokenOwnership),
  getPropertyTokenOwnership: factory.getOne(PropertyTokenOwnership),
  createPropertyTokenOwnership: factory.createOne(PropertyTokenOwnership),
  updatePropertyTokenOwnership: factory.updateOne(PropertyTokenOwnership),
  deletePropertyTokenOwnership: factory.deleteOne(PropertyTokenOwnership),
  getPropertyTokenOwnershipByUserIdAndTokenId,
};