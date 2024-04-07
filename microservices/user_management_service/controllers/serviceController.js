const factory = require('./handlerFactory');
const Service = require('../models/Service');

module.exports = {
  getAllServices: factory.getAll(Service),
  getService: factory.getOne(Service),
  createService: factory.createOne(Service),
  updateService: factory.updateOne(Service),
  deleteService: factory.deleteOne(Service),
};