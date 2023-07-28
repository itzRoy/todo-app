const jwt = require('jsonwebtoken');
const config = require('../../config');

const authenticate = (req, res, next) => {
  const authCookie = req.cookies?.access_token;
  const authHeader = req.headers?.authorization || req.headers?.Authorization;

  if (authCookie || authHeader) {
    jwt.verify(authHeader, config.tokenSecret, (err, decodedToken) => {
    
      if (err) {
        if (err) res.status(403).json({ status: 403, success: false, message: 'Token is not valid!' });
      }
      else {
        // Add the decoded token to the request object
        req.userId = decodedToken.id;
        next();
      }
    });
  }
  else {
    res.status(403).json({ success: false, message: 'Unauthorized!' });
  }
};

module.exports = authenticate;