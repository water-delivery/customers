const user = require('./user');
const auth = require('./auth');

const prefix = '/auth/v1/';
module.exports = function (app) {
  app.use(prefix, user);
  app.use(prefix, auth);
}
