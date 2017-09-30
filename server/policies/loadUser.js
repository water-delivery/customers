const { getToken } = require('../utils');
const constants = require('../constants');
const basicAuth = require('basic-auth');
const AccessToken = require('../models').accessToken;
const User = require('../models').user;
const config = require('../config');

module.exports = (req, res, next) => {
  console.log('loadUser policy');
  req.options = req.options || {};
  // start with setting user to UNAUTHENTICATED
  req.options.user = { type: constants.USER_UNAUTHENTICATED };

  const auth = basicAuth(req) || {};
  const isServiceAccount =
    auth.name === config.credentials.basicAuth.username &&
    auth.pass === config.credentials.basicAuth.password;

  if (isServiceAccount) {
    console.log(auth, config.credentials.basicAuth);
    req.options.user = {
      type: constants.USER_SERVICE_ACCOUNT,
    };
    return next();
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).send(constants.ACCESS_TOKEN_NOT_FOUND);
  }

  return AccessToken.findOne({
    where: { token },
    include: [{
      model: User,
      required: true,
      attributes: ['id', 'firstName', 'lastName', 'avatar', 'contact', 'description', 'email', 'roles']
    }]
  })
  .then(record => {
    if (!record) return res.status(401).send(constants.ACCESS_TOKEN_INVALID);
    req.options.user = record.user;
    req.options.user.type = record.user.roles === 'admin'
      ? constants.USER_ADMIN
      : constants.USER_AUTHENTICATED;

    return next();
  })
  .catch(next);
};
