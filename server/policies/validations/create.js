module.exports = function (req, res, next) {
  console.log('Create validation is running!!!');
  const { contact, password } = req.body || {};
  console.log(req.body);
  if (!contact) {
    return res.status(400).send({
      message: 'Required field `contact` is not sent.'
    });
  }
  if (!password) {
    return res.status(400).send({
      message: 'Required field `password` is not sent.'
    });
  }
  return next();
}
