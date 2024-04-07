const factory = require('./handlerFactory');
const PropertyServiceTransaction = require('../models/PropertyServiceTransaction');

module.exports = {
  getAllPropertyServiceTransactions: factory.getAll(PropertyServiceTransaction),
  getPropertyServiceTransaction: factory.getOne(PropertyServiceTransaction),
  createPropertyServiceTransaction: factory.createOne(PropertyServiceTransaction),
  updatePropertyServiceTransaction: factory.updateOne(PropertyServiceTransaction),
  deletePropertyServiceTransaction: factory.deleteOne(PropertyServiceTransaction),
};