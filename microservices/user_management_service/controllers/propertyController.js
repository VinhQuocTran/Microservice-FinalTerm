const factory = require("./handlerFactory");
const Property = require("../models/Property");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const assignAccountId = (req, res, next) => {
  req.body.accountId = req.user.id;
  next();
};

const verifyProperty = catchAsync(async (req, res, next) => {
  const { result, note } = req.body; // result = "1" or "-1"
  const { id } = req.params;

  const property = await Property.findByPk(id);
  if (!property) {
    return next(new AppError("There is no property match the ID.", 404));
  }

  // 1) Update property.isVerified
  property.isVerified = result;
  await property.save();

  // 2) Insert a new record to submit_property
  const SubmitProperty = require("../models/SubmitProperty");
  await SubmitProperty.create({
    result,
    note,
    submitType: "verification",
    propertyId: id,
  });

  res.status(200).json({
    status: "success",
    message: "Verify property success",
  });
});

const requestListingProperty = catchAsync(async (req, res, next) => {
  const propertyId = req.params.id;
  const { backgroundCheck, inspection, valuation } = req.body;
  const totalPrice = parseInt(req.body.totalPrice);

  // user = req.user
  // check user's cash balance
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

  res.status(200).json({
    status: "success",
    data: req.user,
    message: "Request listing property success",
  });
});

const listingProperty = catchAsync(async (req, res, next) => {
  const { result, note } = req.body;
  const id = req.params.id;

  const property = await Property.findByPk(id);
  if (!property) {
    return next(new AppError("There is no property match the ID.", 404));
  }

  // 1) Update property.isVerified
  property.isListed = result;
  await property.save();

  // 2) Insert a new record to submit_property
  const SubmitProperty = require("../models/SubmitProperty");
  await SubmitProperty.create({
    result,
    note,
    submitType: "listing",
    propertyId: id,
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
  listingProperty
};
