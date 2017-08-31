const Address = require('../models').address;

module.exports = (req, res, next) => {
  const userId = req.options.user.id;
  return Address.findOne({
    where: { userId },
  })
  .then(record => {
    if (!record) res.notFound({ message: 'Address not found!' });
    next();
  })
  .catch(next);
};
