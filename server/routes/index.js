const user = require('./user');
const auth = require('./auth');
const address = require('./address');

const prefix = '/auth/v1/';
module.exports = (app) => {
  app.use(prefix, user);
  app.use(prefix, auth);
  app.use(prefix, address);
};
