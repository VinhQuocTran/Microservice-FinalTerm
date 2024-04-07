const factory = require("./handlerFactory");
const Property = require("../models/Property");
const SubmitProperty = require("../models/SubmitProperty");
const ListingProperty = require("../models/ListingProperty");
const Service = require('../models/Service');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const assignAccountId = (req, res, next) => {
  req.body.accountId = req.user.id;
  next();
};

const verifyProperty = catchAsync(async (req, res, next) => {
  const { result, note, serviceId } = req.body; // result = "1" or "-1", serviceId is a service with service_type=ST01
  const { id } = req.params;

  const property = await Property.findByPk(id);
  if (!property) {
    return next(new AppError("There is no property match the ID.", 404));
  }

  // Retrieve property owner
  const Account = require("../models/Account");
  const owner = await Account.findByPk(property.accountId);

  // Update property.isVerified
  property.isVerified = result;
  await property.save();

  // Retrieve background check service
  const service = await Service.findByPk(serviceId);

  // Check if user's cash balance < service.feePerTime
  if (owner.cashBalance < service.feePerTime) {
    return next(new AppError("Cash balance is not valid.", 400));
  }

  // Insert a new record to submit_property
  await SubmitProperty.create({
    result,
    note,
    submitType: "verification",
    fee: service.feePerTime,
    propertyId: id,
  });

  // Update user's cash balance
  owner.cashBalance -= service.feePerTime;
  await owner.save();

  res.status(200).json({
    status: "success",
    message: result == 1 ? "Property is verified." : "Property is not verified",
  });
});

const requestListingProperty = catchAsync(async (req, res, next) => {
  const propertyId = req.params.id;
  const totalPrice = parseInt(req.body.totalPrice);

  // user = req.user
  // check user's cash balance >= totalPrice
  if (req.user.cashBalance >= totalPrice) {
    return next(new AppError("Cash balance is not valid.", 400));
  }

  // withdraw and update
  req.user.cashBalance -= totalPrice;
  await req.user.save();

  // update property.isListed=0 (pending)
  await Property.update(
    { isListed: "0" },
    {
      where: { id: propertyId },
    }
  );

  // insert a new record to submit_property
  await SubmitProperty.create({
    result: "0",
    note: "",
    fee: totalPrice,
    submitType: "listing",
    propertyId
  });

  res.status(200).json({
    status: "success",
    data: req.user,
    message: "Request listing property success",
  });
});

const listingProperty = catchAsync(async (req, res, next) => {
  const { result, note } = req.body; // result = 1 or -1
  const { propertyValuation, monthlyRent, tokenSupply, tokenPrice, serviceId } =
    req.body;
  const id = req.params.id;

  const property = await Property.findByPk(id);
  if (!property) {
    return next(new AppError("There is no property match the ID.", 404));
  }

  // update property.isVerified
  property.isListed = result;
  await property.save();

  // retrieve property manager service
  const service = await Service.findByPk(serviceId);

  // check user's cash balance >= service.feePerTime
  if (req.user.cashBalance >= service.feePerTime) {
    return next(new AppError('Cash balance is not valid.', 400));
  }

  // update user's cash balance
  req.user.cashBalance -= service.feePerTime;
  await req.user.save();

  // update submit_property where submit_type=listing and propertyId=id
  const submitProperty = await SubmitProperty.findOne({ where: { propertyId: id, submitType: 'listing' } });
  submitProperty.result = result;
  submitProperty.fee += service.feePerTime;
  await submitProperty.save();

  // insert a new record to listing_property
  await ListingProperty.create({
    propertyValuation,
    monthlyRent,
    tokenSupply,
    tokenPrice,
    submitPropertyId: submitProperty.id,
    serviceId,
  });

  res.status(200).json({
    status: "success",
    message: "Listing property success",
  });
});

module.exports = {
  getProperty: factory.getOne(Property),
  getAllProperties: factory.getAll(Property),
  createProperty: factory.createOne(Property),
  updateProperty: factory.updateOne(Property),
  assignAccountId,
  verifyProperty,
  requestListingProperty,
  listingProperty,
};
