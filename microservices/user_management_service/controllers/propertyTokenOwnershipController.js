const factory = require('./handlerFactory');
const PropertyTokenOwnership = require('../models/PropertyTokenOwnership');

module.exports = {
  getAllPropertyTokenOwnerShips: factory.getAll(PropertyTokenOwnership),
  getPropertyTokenOwnership: factory.getOne(PropertyTokenOwnership),
  createPropertyTokenOwnership: factory.createOne(PropertyTokenOwnership),
  updatePropertyTokenOwnership: factory.updateOne(PropertyTokenOwnership),
  deletePropertyTokenOwnership: factory.deleteOne(PropertyTokenOwnership),
};