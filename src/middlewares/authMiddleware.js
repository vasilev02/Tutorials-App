const { TOKEN_COOKIE_NAME, SECRET } = require('../constants');
const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
  let token = req.cookies[TOKEN_COOKIE_NAME];

  if (!token) {
    return next();
  }

  jwt.verify(token, SECRET, function (err, decodedToken) {
    if (err) {
      return res.status(401).redirect('/login');
    }

    req.user = decodedToken;
    res.locals.user = decodedToken;
    res.locals.isAuthenticated = true;
    next();
  });
};

const isAuthenticated = function (req, res, next) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  next();
}

const isGuest = function (req, res, next) {
  if (req.user) {
    return res.redirect('/');
  }

  next();
}

module.exports = { auth, isAuthenticated, isGuest };