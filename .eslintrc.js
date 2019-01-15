const fs = require('fs');

const config = {
  "extends": "airbnb",
  "rules": {
    "comma-dangle": 0,
    "arrow-parens": 0,
    "arrow-body-style": 0
  },
  "env": {
    "node": true,
    "mocha": true
  },
  "globals": {
    "logger": true
  }
};

const models = fs.readdirSync(`${__dirname}/server/models`)
  .filter(f => !f.includes('index') && f.includes('.js'))
  .map(f => f.replace('.js', ''));

models.forEach(model => {
  config.globals[model] = true;
});

module.exports = config;
