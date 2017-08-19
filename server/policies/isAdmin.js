const {
  USER_SERVICE_ACCOUNT,
  USER_ADMIN,
  AUTHENTICATION_NEEDED_AS_ADMIN
} = require('../constants');

const adminLevelTypes = [USER_SERVICE_ACCOUNT, USER_ADMIN];
module.exports = (req, res, next) => {
  console.log('isAdmin Policy running');
  if (req.options && adminLevelTypes.includes(req.options.user.type)) return next();

  return res.status(401).send(AUTHENTICATION_NEEDED_AS_ADMIN);
};
