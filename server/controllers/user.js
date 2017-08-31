const User = require('../models').user;

const selectFields = ['id', 'firstName', 'lastName', 'avatar', 'contact', 'description', 'email', 'roles'];
module.exports = {
  findMe: (req, res) => res.ok(req.options.user),

  findOne: (req, res) =>
    res.status(200).send({
      message: 'findOne'
    }),

  findAll: (req, res) => {
    const userIds = (req.query && req.query.id) || [];
    if (userIds && userIds.length < 1) {
      return res.ok({ message: 'Expecting user ids as query params' });
    }
    return User.findAll({
      where: {
        id: userIds
      },
      attributes: selectFields
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  update: (req, res) => {
    const userId = req.options.user.id;
    const { firstName, lastName, avatar, description, email } = req.body || {};
    User.update({
      firstName,
      lastName,
      avatar,
      description,
      email
    }, {
      where: {
        id: userId
      },
      individualHooks: true
    })
    .then(([, affectedRows]) => res.ok(affectedRows))
    .catch(res.negotiate);
  },

  updateAddress: (req, res) => {
    const { activeAddress } = req.body || {};
    const id = req.options.user.id;
    if (!activeAddress) res.badRequest({ message: 'activeAddress is needed to update' });
    return User.update({
      activeAddress
    }, {
      where: {
        id
      }
    })
    .then(res.ok)
    .catch(res.negotiate);
  }
};
