const factory = require('./handlerFactory');
const ListingProperty = require('../models/ListingProperty');

module.exports = {
  getAllListingProperties: factory.getAll(ListingProperty),
  getListingProperty: factory.getOne(ListingProperty),
  createListingProperty: factory.createOne(ListingProperty),
  updateListingProperty: factory.updateOne(ListingProperty),
  deleteListingProperty: factory.deleteOne(ListingProperty),
};