const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports.createToken = (id) => {
  return jwt.sign({ id }, config.tokenSecret, { expiresIn: 300000});
};

module.exports.parseQueryParam = (queryParams) => {
  const parsedParams = {};

  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      const value = queryParams[key];
      if (value === 'true') {
        parsedParams[key] = true;
      } else if (value === 'false') {
        parsedParams[key] = false;
      } else if (!isNaN(Number(value))) {
        parsedParams[key] = Number(value);
      } else {
        parsedParams[key] = value;
      }
    }
  }

  return parsedParams;
};