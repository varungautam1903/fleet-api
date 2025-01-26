const _ = require("lodash");
const utils = require("../../components/utils");
const User = require("./user.model");
const UserInfo = require("./userInfo.model");

const WHITELIST_ATTRIBUTES = [
  "_id",
  "firstName",
  "middleName",
  "lastName",
  "displayName",
  "email",
  "address",
  "postCode",
  "dob",
  "isActive",
  "phoneNo",
  "addPhoneNo"
];

const WHITELIST_REQUEST_ATTRIBUTES = [
  'driverId',
  'firstName',
  'middleName',
  'lastName',
  'email',
  'password',
  'address',
  'postCode',
  'dob',
  "isActive",
  'phoneNo',
  'addPhoneNo',
  'role'
];

const UserAdminController = {
  /**
   * Gets a list of items
   */
  index: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || 20;
      const skip = Number(req.query.skip) || 0;
      const sort = req.query.sort || "-createdAt";
      const select = WHITELIST_ATTRIBUTES.join(" ");
      const query = {};

      if (req.query.dn) {
        query.displayName = { $regex: `${req.query.dn}.*`, $options: "i" };
      }

      // TODO: Build query based on params
      const itemCount = await User.find(query).countDocuments();
      const items = await User.find(query)
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
  * Updates the Company Info
  */
  update: async (req, res, next) => {
    try {
      const updatedUser = utils.sanitizeObject(
        req.body,
        WHITELIST_REQUEST_ATTRIBUTES
      );
      const user = await User.findById({ _id: req.params.id });

      if (user) {
        _.assign(user, updatedUser);
        await user.save();

        const response = utils.sanitizeObject(user, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Creates a new user by Admin
   */
  addUser: async (req, res, next) => {
    try {
      const newUser = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      let user = await User.create(newUser);
      utils.respondWithResult(res)({ message: 'Thanks!' });
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Returns the User By Id
   */
  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      const detail = await UserInfo.findOne({ _user: user._id });
      const isValid = detail ? true: false; 
      if (user) {
        const response = utils.sanitizeObject(user, WHITELIST_ATTRIBUTES);
        response.isValid = isValid;
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

};

module.exports = UserAdminController;
