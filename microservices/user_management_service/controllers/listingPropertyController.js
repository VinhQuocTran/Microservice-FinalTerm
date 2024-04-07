const factory = require("./handlerFactory");
const ListingProperty = require("../models/ListingProperty");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getTokenSupply = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;

  // 1) Get SubmitProperty where propertyId and submit_type=listing and result=1
  const SubmitProperty = require('../models/SubmitProperty');
  const submitProperty = await SubmitProperty.findOne({
    where: {
      propertyId,
      submitType: 'listing',
      result: "1"
    }
  });

  if (!submitProperty) {
    return next(new AppError('There is no SubmitProperty that match ID.', 404));
  }

  // 2) Get ListingProperty where submitPropertyId = submitProperty.id
  const ListingProperty = require('../models/ListingProperty');
  const listingProperty = await ListingProperty.findOne({ where: { submitPropertyId: submitProperty.id } });

  if (!listingProperty) {
    return next(new AppError('There is no ListingProperty that match ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: listingProperty,
  });
});

module.exports = {
  getAllListingProperties: factory.getAll(ListingProperty),
  getListingProperty: factory.getOne(ListingProperty),
  createListingProperty: factory.createOne(ListingProperty),
  updateListingProperty: factory.updateOne(ListingProperty),
  deleteListingProperty: factory.deleteOne(ListingProperty),
  getTokenSupply,
};
