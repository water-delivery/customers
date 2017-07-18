const user = require('./user');
const auth = require('./auth');

module.exports = function (app) {
  app.use(user);
  app.use(auth);
}
