const _ = require('lodash');
const utils = require('../../components/utils');
const History = require('./history.model');

const WHITELIST_ATTRIBUTES = [
  '_id',
  '_user',
  '_depot',
  '_vehicle',
  'franchiseId',
  'routeNo',
  'routeDate',
  'stops',
  'postCode'
];

const WHITELIST_REQUEST_ATTRIBUTES = [
  '_id',
  '_user',
  '_depot',
  '_vehicle',
  'franchiseId',
  'routeNo',
  'routeDate',
  'stops',
  'postCode'
];

const WHITELIST_USER_ATTRIBUTES = [
  'displayName',
  'phoneNo'
];

const WHITELIST_DEPOT_ATTRIBUTES = [
  'name',
];

const WHITELIST_VEHICLE_ATTRIBUTES = [
  'reg',
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

      const populateQuery = [
        { path: '_user', select: WHITELIST_USER_ATTRIBUTES },
        { path: '_depot', select: WHITELIST_DEPOT_ATTRIBUTES },
        { path: '_vehicle', select: WHITELIST_VEHICLE_ATTRIBUTES }
      ];

      if (req.user._depot) {
        query._depot = req.user._depot;
      }
      // TODO: Build query based on params
      const itemCount = await History.find(query).countDocuments();

      const items = await History
        .find(query)
        .select(select)
        .populate(populateQuery)
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
      let item = req.body;
      if (req.user._depot) {
        utils.respondWithError({ message: 'You are not auhorized to add History' });
      }

      item._depot = req.user?._depot;
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
