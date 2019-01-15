module.exports = {
  api: process.env.API || 'http://api.arkraiders.dev',
  NOTIFICATION_SERVICE_HOST: `http://${process.env.NOTIFICATION_SERVICE}`,
};
