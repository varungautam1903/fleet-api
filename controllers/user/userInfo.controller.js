const _ = require("lodash");
const utils = require("../../components/utils");
const User = require("./user.model");
const UserInfo = require("./userInfo.model");

const WHITELIST_ATTRIBUTES = [
  "_id",
  'bankName',
  'accountNo',
  'sortCode',
  'passportNo',
  'licenceNo',
  'nINo',
  '_user'
];

const WHITELIST_REQUEST_ATTRIBUTES = [
  '_user',
  'bankName',
  'accountNo',
  'sortCode',
  'passportNo',
  'licenceNo',
  'nINo'
];

const UserInfoAdminController = {
  /**
   * Gets a list of items
   */
  // index: async (req, res, next) => {
  //   try {
  //     const limit = Number(req.query.limit) || 20;
  //     const skip = Number(req.query.skip) || 0;
  //     const sort = req.query.sort || "-createdAt";
  //     const select = WHITELIST_ATTRIBUTES.join(" ");
  //     const query = {};

  //     if (req.query.dn) {
  //       query.displayName = { $regex: `${req.query.dn}.*`, $options: "i" };
  //     }

  //     // TODO: Build query based on params
  //     const itemCount = await User.find(query).countDocuments();
  //     const items = await User.find(query)
  //       .select(select)
  //       .sort(sort)
  //       .limit(limit)
  //       .skip(skip);

  //     utils.respondWithResult(res)({ items, itemCount });
  //   } catch (err) {
  //     utils.handleError(next)(err);
  //   }
  // },

  /**
  * Updates the Company Info
  */
  // update: async (req, res, next) => {
  //   try {
  //     const updatedUser = utils.sanitizeObject(
  //       req.body,
  //       WHITELIST_REQUEST_ATTRIBUTES
  //     );
  //     const user = await User.findById({ _id: req.params.id });

  //     if (user) {
  //       _.assign(user, updatedUser);
  //       await user.save();

  //       const response = utils.sanitizeObject(user, WHITELIST_ATTRIBUTES);
  //       utils.respondWithResult(res)(response);
  //     } else {
  //       utils.handleEntityNotFound(res);
  //     }
  //   } catch (err) {
  //     utils.handleError(next)(err);
  //   }
  // },

  /**
   * Creates User Info
   */
  create: async (req, res, next) => {
    try {
      const newUserInfo = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      const userInfo = await UserInfo.create(newUserInfo);
      utils.respondWithResult(res)({ message: 'Created Successfully' });
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * Returns the User By Id
   */
  getUserInfoById: async (req, res, next) => {
    try {
      const userInfo = await UserInfo.findOne({ _user: req.params.id });
      if (userInfo) {
        const response = utils.sanitizeObject(userInfo, WHITELIST_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

};

module.exports = UserInfoAdminController;
