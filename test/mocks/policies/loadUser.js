const basicAuth = require('basic-auth');
const {
  UNAUTHENTICATED_USER_HEADER,
  USER_UNAUTHENTICATED,
  USER_ADMIN,
  USER_AUTHENTICATED,
  USER_SERVICE_ACCOUNT
} = require('../../../server/constants');
const credentials = require('../../../server/config').credentials;

module.exports = function loadUser(req, res, next) {
  const authorization = req.header('Authorization');
  const params = req.params.all();

  req.options = req.options || {};

  /*
    When mocking loadUser policy, AUTHENTICATED is the default type of user.
    UNAUTHENTICATED, ADMIN and SERVICE_ACCOUNTS are declared explicitly in tests.
   */

  if (authorization === UNAUTHENTICATED_USER_HEADER) {
    req.options.user = {
      type: USER_UNAUTHENTICATED
    };
    return next();
  }

  const basicAuthResult = basicAuth(req) || {};
  const isServiceAccount =
    basicAuthResult.name === credentials.basicAuth.username &&
    basicAuthResult.pass === credentials.basicAuth.password;

  if (isServiceAccount) {
    req.options.user = {
      type: USER_SERVICE_ACCOUNT,
      isAdmin: true
    };
    return next();
  }

  // default: AUTHENTICATED_USER
  req.options.user = {
    type: params.isAdmin === 'true' ? USER_ADMIN : USER_AUTHENTICATED,
    id: 1,
    username: 'john',
    email: 'john@gmail.com',
    isAdmin: params.isAdmin === 'true',
    createdAt: '2017-02-01T17:22:10.000Z',
    verifiedAt: '2017-02-01T17:22:10.000Z',
    age: 17
  };

  return next();
};
