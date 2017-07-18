const User = require('../models').user;
const async = require('async');

const validations = {
  USER_NOT_FOUND: {
    message: 'User not found in the database'
  },
  PASSWORD_NOT_MATCHED: {
    message: 'Password didn\'t match with the given username'
  }
}
module.exports = {
  findMe: function (req, res) {
    return res.status(200).send({
      message: 'findMe',
      user: req.options.user
    });
  },

  findOne: function (req, res) {
    return res.status(200).send({
      message: 'findOne'
    });
  },

  findAll: function (req, res) {
    return res.status(200).send({
      message: 'findAll'
    });
  },

  update: function (req, res) {
    return res.status(200).send({
      message: 'findMe'
    });
  },
}
