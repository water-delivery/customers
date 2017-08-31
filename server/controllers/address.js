const Address = require('../models').address;

module.exports = {
  findAll: (req, res) => {
    const userId = req.options.user.id;
    return Address.findAll({
      where: {
        userId
      },
    })
    .then(res.ok)
    .catch(res.negotiate);
  },

  create: (req, res) => {
    const userId = req.options.user.id;
    const { fullName, address, addressLine1, landmark, pincode, state } = req.body || {};
    if (!(fullName && address && addressLine1)) {
      return res.badRequest({
        message: 'Required fields `fullName`, `address`, `addressLine1` are missing'
      });
    }
    return Address.create({
      userId,
      fullName,
      address,
      addressLine1,
      landmark,
      pincode,
      state
    })
    .then(res.created)
    .catch(res.negotiate);
  },

  delete: (req, res) =>
    Address.destroy({
      where: { id: req.params.id },
      force: true
    })
    .then(res.noContent)
    .catch(res.negotiate),

  update: (req, res) => {
    const userId = req.options.user.id;
    const id = req.params.id;
    const { address, addressLine1, landmark, fullName } = req.body;
    return Address.update({
      address,
      addressLine1,
      landmark,
      fullName
    }, {
      where: {
        id,
        userId
      }
    })
    .then(([, affectedRows]) => {
      const response = {
        message: 'Updated successfully!'
      };
      if (affectedRows === 0) return res.ok({ message: 'No records matched for given ids' });
      return res.ok(response);
    })
    .catch(res.negotiate);
  },
};
