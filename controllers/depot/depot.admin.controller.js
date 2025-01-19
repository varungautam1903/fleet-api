const _ = require('lodash');
const utils = require('../../components/utils');
const Depot = require('./depot.model');

const WHITELIST_ATTRIBUTES = [
  '_id',
  'name',
  'address',
  'postCode'
];

const WHITELIST_REQUEST_ATTRIBUTES = [
  'name',
  'address',
  'postCode'
];

const DepotAdminController = {

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
      const itemCount = await Depot.find(query).countDocuments();

      const items = await Depot
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
   * Creates a new Depot
   */
  create: async (req, res, next) => {
    try {
      const newDepot = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      let depot = await Depot.create(newDepot);
      depot = depot.toObject();
      const response = utils.sanitizeObject(depot, WHITELIST_ATTRIBUTES);
      utils.respondWithResult(res)(response);
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Returns the Depot By Id
   */
  show: async (req, res, next) => {
    try {
      const depot = await Depot.findById({ _id: req.params.id });

      if (depot) {
        const response = utils.sanitizeObject(depot, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Updates the Depot Info
   */
  update: async (req, res, next) => {
    try {
      const updatedDepot = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      const depot = await Depot.findById({ _id: req.params.id });

      if (depot) {
        _.assign(depot, updatedDepot);
        await depot.save();

        const response = utils.sanitizeObject(depot, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

};

module.exports = DepotAdminController;
