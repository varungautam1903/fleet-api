const _ = require('lodash');
const utils = require('../../components/utils');
const Vehicle = require('./vehicle.model');

const WHITELIST_ATTRIBUTES = [
  '_id',
  'reg',
  'make',
  'model',
  'mot',
  'roadTax',
  'insurance',
  'service',
  'mileage',
  'status'
];

const WHITELIST_REQUEST_ATTRIBUTES = [
  'reg',
  'make',
  'model',
  'mot',
  'roadTax',
  'insurance',
  'service',
  'mileage',
  'status'
];

const VehicleAdminController = {

  /**
   * Gets a list of items
   */
  index: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || 20;
      const skip = Number(req.query.skip) || 0;
      const sort = req.query.sort || '-createdAt';
      const select = WHITELIST_ATTRIBUTES.join(' ');

      const query = {};
      // TODO: Build query based on params
      const itemCount = await Vehicle.find(query).countDocuments();

      const items = await Vehicle
        .find(query)
        .select(select)
        .sort(sort)
        .limit(limit)
        .skip(skip);

      utils.respondWithResult(res)({ items, itemCount });
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Creates a new Vehicle
   */
  create: async (req, res, next) => {
    try {
      const newVehicle = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      let vehicle = await Vehicle.create(newVehicle);
      vehicle = vehicle.toObject();
      const response = utils.sanitizeObject(vehicle, WHITELIST_ATTRIBUTES);
      utils.respondWithResult(res)(response);
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Returns the Vehicle By Id
   */
  show: async (req, res, next) => {
    try {
      const vehicle = await Vehicle.findById({ _id: req.params.id });

      if (vehicle) {
        const response = utils.sanitizeObject(vehicle, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Updates the Vehicle Info
   */
  update: async (req, res, next) => {
    try {
      const updatedVehicle = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      const vehicle = await Vehicle.findById({ _id: req.params.id });

      if (vehicle) {
        _.assign(vehicle, updatedVehicle);
        await vehicle.save();

        const response = utils.sanitizeObject(vehicle, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

};

module.exports = VehicleAdminController;
