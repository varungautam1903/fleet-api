const utils = require('../../components/utils/index');
const User = require('./user.model');
const authUtils = require('../../components/utils/authUtils');

const WHITELIST_ATTRIBUTES = [
  '_id',
  'firstName',
  'lastName',
  'displayName',
  'email',
  'token'
];

const WHITELIST_LOGGEDIN_ATTRIBUTES = [
  'firstName',
  'middleName',
  'lastName',
  'displayName',
  'email',
  'address',
  'postCode',
  'dob',
  'phoneNo',
  'addPhoneNo'
]

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
  'phoneNo',
  'addPhoneNo',
  'isActive'
];

const UserController = {

  /**
   * Creates a new user
   */
  register: async (req, res, next) => {
    try {
      const newUser = utils.sanitizeObject(req.body, WHITELIST_REQUEST_ATTRIBUTES);
      let user = await User.create(newUser);
      utils.respondWithResult(res)({ message: 'Thanks! Your Account is under review.' });
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  /**
   * login User
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user && !user.isActive) {
        res.status(401).json({ message: 'Your Account is under review.' });
      }

      if (user && (await user.matchPassword(password))) {
        const token = authUtils.generateToken(user._id, user.role);
        res.json({
          _id: user._id,
          email: user.email,
          token: token,
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

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

      if (req.query.dn) {
        query.displayName = { $regex: `${req.query.dn}.*`, $options: 'i' };
      }

      // TODO: Build query based on params
      const itemCount = await User
        .find(query)
        .countDocuments();
      const items = await User
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
   * Returns the User By Id
   */
  show: async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.params.id });

      if (user) {
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
   * Returns the User By Id
   */
  showLoggedUser: async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.user._id });

      if (user) {
        const response = utils.sanitizeObject(user, WHITELIST_LOGGEDIN_ATTRIBUTES);
        utils.respondWithResult(res)(response);
      } else {
        utils.handleEntityNotFound(res);
      }
    } catch (err) {
      utils.handleError(next)(err);
    }
  },

  

};

module.exports = UserController;
