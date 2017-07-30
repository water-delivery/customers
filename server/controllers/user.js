const User = require('../models').user;

module.exports = {
  findMe: (req, res) => res.ok(req.options.user),

  findOne: (req, res) => {
    return res.status(200).send({
      message: 'findOne'
    });
  },

  findAll: (req, res) => {
    return res.status(200).send({
      message: 'findAll'
    });
  },

  update: (req, res) => {
    return res.status(200).send({
      message: 'findMe'
    });
  },
};
