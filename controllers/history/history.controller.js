const _ = require('lodash');
const utils = require('../../components/utils');
const History = require('./history.model');

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

const HistoryController = {

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
      const itemCount = await History.find(query).countDocuments();

      const items = await History
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
   * Creates a new History
   */
  create: async (req, res, next) => {
    try {
      const newHistory = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      let history = await History.create(newHistory);
      history = history.toObject();
      const response = utils.sanitizeObject(history, WHITELIST_ATTRIBUTES);
      utils.respondWithResult(res)(response);
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Returns the History By Id
   */
  show: async (req, res, next) => {
    try {
      const history = await History.findById({ _id: req.params.id });

      if (history) {
        const response = utils.sanitizeObject(history, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Updates the History Info
   */
  update: async (req, res, next) => {
    try {
      const updatedHistory = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      const history = await Depot.findById({ _id: req.params.id });

      if (depot) {
        _.assign(history, updatedHistory);
        await history.save();

        const response = utils.sanitizeObject(history, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

};

module.exports = HistoryController;
