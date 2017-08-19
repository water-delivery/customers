const constants = require('../constants');

module.exports = function isAdmin(req, res, next) {
  if (req.options &&
    req.options.user &&
    req.options.user.type === constants.USER_SERVICE_ACCOUNT) return next();
  return res.forbidden({ message: 'Un-authorized access' });
};
