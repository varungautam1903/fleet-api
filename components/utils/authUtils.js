const jwt = require('jsonwebtoken');

const authUtils = {

  /**
   * Generate Token
   * @param  {Object} id, role The response object for the request
   * @return {String<Token>} return Token
   */
  generateToken: (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },

  decodeToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

};

module.exports = authUtils;
