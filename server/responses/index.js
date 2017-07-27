const ok = require('./ok');
const created = require('./created');
const serverError = require('./serverError');
const negotiate = require('./negotiate');
const notFound = require('./notFound');

module.exports = (req, res, next) => {
  res.ok = ok(res);
  res.created = created(res);
  res.serverError = serverError(res);
  res.negotiate = negotiate(res);
  res.notFound = notFound(res);
  next();
};
