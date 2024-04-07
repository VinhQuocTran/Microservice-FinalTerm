const factory = require('./handlerFactory');
const SubmitProperty = require('../models/SubmitProperty');

module.exports = {
  getAllSubmitProperty: factory.getAll(SubmitProperty),
  getSubmitProperty: factory.getOne(SubmitProperty),
  createSubmitProperty: factory.createOne(SubmitProperty),
  updateSubmitProperty: factory.updateOne(SubmitProperty),
  deleteSubmitProperty: factory.deleteOne(SubmitProperty),
}