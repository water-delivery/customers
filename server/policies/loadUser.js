const { getToken } = require('../utils');
const constants = require('../constants');
const AccessToken = require('../models').accessToken;
const User = require('../models').user;

module.exports = function (req, res, next) {
  req.options = req.options || {};
  const token = getToken(req);
  if (!token) {
    return res.status(401).send(constants.ACCESS_TOKEN_NOT_FOUND)
  }

  AccessToken.findOne({
    where: { token },
    include: [{
      model: User,
      attributes: ['firstName', 'lastName', 'avatar', 'contact', 'description', 'email']
    }]
  })
  .then(record => {
    if (!record) res.status(401).send(constants.ACCESS_TOKEN_INVALID);
    req.options.user = record.user;
    next();
  })
  .catch(next);
}
