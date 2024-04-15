const factory = require("./handlerFactory");
const Property = require("../models/Property");
const SubmitProperty = require("../models/SubmitProperty");
const ListingProperty = require("../models/ListingProperty");
const PropertyTokenOwnership = require('../models/PropertyTokenOwnership');
const Account = require('../models/Account');
const Service = require("../models/Service");
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
    serviceId,
  });

  // Update property.isVerified
  property.isVerified = result;
  await property.save();

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
  const serviceId = req.body.inspection;
  const totalPrice = parseInt(req.body.totalPrice);

  // user = req.user
  // check user's cash balance >= totalPrice
  if (req.user.cashBalance < totalPrice) {
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
    propertyId,
    serviceId,
  });

  res.status(200).json({
    status: "success",
    data: req.user,
    message: "Request listing property success",
  });
});

const listProperty = catchAsync(async (req, res, next) => {
  const {
    result,
    note,
    propertyValuation,
    monthlyRent,
    serviceId,
  } = req.body;
  const id = req.params.id;

  const property = await Property.findByPk(id);

  if (!property) {
    return next(new AppError("There is no property match the ID.", 404));
  }

  const propertyOwner = await Account.findByPk(property.accountId);

  // retrieve property manager service
  const service = await Service.findByPk(serviceId);

  // check user's cash balance >= service.feePerTime
  if (propertyOwner.cashBalance < service.feePerTime) {
    return next(new AppError("Property owner's cash balance is not valid.", 400));
  }

  // update user's cash balance
  propertyOwner.cashBalance -= service.feePerTime;
  await propertyOwner.save();

  // update property.isListed
  property.isListed = result;
  await property.save();

  // update submit_property where submit_type=listing and propertyId=id
  const submitProperty = await SubmitProperty.findOne({
    where: { propertyId: id, submitType: "listing" },
  });
  submitProperty.result = result;
  submitProperty.fee += service.feePerTime;
  submitProperty.note = note;
  await submitProperty.save();

  const listingProperty = await ListingProperty.create({
    propertyValuation,
    monthlyRent,
    tokenSupply: propertyValuation / 50,
    submitPropertyId: submitProperty.id,
    serviceId,
  });

  // add a new record to property_token_ownership
  await PropertyTokenOwnership.create({
    ownNumber: propertyValuation / 50, // 50 is default token price 
    listingPropertyId: listingProperty.id,
    accountId: propertyOwner.id,
  });

  res.status(200).json({
    status: "success",
    message: "Listing property success",
  });
});

const getRequestListingProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const property = await Property.findByPk(id);
  const submitProperty = await SubmitProperty.findOne({
    where: { propertyId: id, submitType: "listing" },
  });

  const service = await Service.findByPk(submitProperty.serviceId);

  res.status(200).json({
    status: "success",
    data: {
      property,
      service,
    },
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
  listProperty,
  getRequestListingProperty,
};
