module.exports = (req, res, next) => {
  logger.info('Create validation is running!!!');
  const { contact } = req.body || {};
  if (!contact) {
    return res.status(400).send({
      message: 'Required field `contact` is not sent.'
    });
  }
  return next();
};
