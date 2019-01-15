const db = require('../../server/models');

function setup(callback) {
  db.sequelize.authenticate()
  .then(err => {
    if (err) return callback(err);
    return db.sequelize.sync({
      force: true,
      // logging: console.log
    }).then(callback);
  })
  .catch(() => callback());
}

function clearDatabase(sequelize) {
  return sequelize
    .getQueryInterface()
    .dropAllTables()
    .then(() => {
      sequelize.modelManager.models = []; // eslint-disable-line
      sequelize.models = {}; // eslint-disable-line
      return sequelize
        .getQueryInterface()
        .dropAllEnums();
    });
}

function teardown(callback) {
  clearDatabase(db.sequelize);
  return callback();
}

module.exports = {
  setup,
  teardown,
  clearDatabase
};
