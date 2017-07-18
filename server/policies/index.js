const validations = require('./validations');
const isAdmin = require('./isAdmin');
const loadUser = require('./loadUser');

module.exports = {
  isAdmin,
  loadUser,
  validations
}
