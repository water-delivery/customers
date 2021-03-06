const async = require('async');
const User = require('../models').user;
const AccessToken = require('../models').accessToken;
const redisService = require('../services').redis;
const smsService = require('../services').sms;
const notificationService = require('../services').notification;

const {
  generateRandomNumber,
  generateOTPTextMessage,
  getToken
} = require('../utils');
const {
  CONTACT_NUMBER_VERIFICATION,
  ACCOUNT_AUTHENTICATION,
  USER_NOT_FOUND,
  INVALID_OTP,
  OTP_MISMATCH
} = require('../constants');

module.exports = {
  signup: (req, res) => {
    const { firstName, lastName, otp, contact, description, email, meta } = req.body;
    // All validations should be done by now!
    // TODO: Get other possible information from the device he is logging in!
    const userObject = {
      firstName,
      lastName,
      contact,
      description,
      email,
      meta
    };
    return async.waterfall([
      function validateOTP(next) {
        const criteria = {
          type: CONTACT_NUMBER_VERIFICATION,
          token: contact
        };
        return redisService.findOne(criteria)
        .then(value => {
          if (!value) return next(INVALID_OTP);
          if (parseInt(value.data, 10) !== otp) return next(OTP_MISMATCH);
          // Dont wait for this response
          redisService.destroy(criteria);
          return next();
        })
        .catch(next);
      },
      function createUser(next) {
        User.create(userObject)
        .then(record => next(null, record))
        // .catch(err => next(err));
        .catch(next);
      },
      function issueAccessToken(user, next) {
        AccessToken.create({
          userId: user.id,
          device: meta && meta.device
        })
        .then(newToken => next(null, {
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          contact: user.contact,
          description: user.description,
          email: user.email,
          roles: user.roles,
          accessToken: newToken.token
        }))
        .catch(next);
      },
    ], (error, user) => {
      if (error) {
        if (error.name) {
          switch (error.name) {
            case 'SequelizeValidationError':
              return res.status(400).send(error);
            case 'SequelizeUniqueConstraintError':
              return res.status(400).send({
                errors: error.errors,
                fields: error.fields
              });
            default:
              return res.status(400).send(error);
          }
        }
        return res.status(400).send(error);
      }
      const { token } = req.body;
      const { deviceId } = req.options;
      if (token && deviceId) {
        notificationService.subscribe({
          userId: user.id,
          userType: 'user',
          token,
          deviceId,
          contact,
          firstName,
          status: 'loggedIn'
        })
        .then(logger.debug)
        .catch(logger.error);
      }
      return res.status(201).send(user);
    });
  },

  signin: (req, res) => {
    // All validations should be done by now!
    const { contact, otp, meta, token } = req.body;
    return async.waterfall([
      function findUser(next) {
        User.findOne({ where: { contact } })
        .then(user => {
          if (!user) return res.notFound(USER_NOT_FOUND);
          return next(null, user);
        })
        .catch(next);
      },
      function validateOTP(user, next) {
        const criteria = {
          type: ACCOUNT_AUTHENTICATION,
          token: contact
        };
        return redisService.findOne(criteria)
        .then(value => {
          if (!value) return next(INVALID_OTP);
          if (parseInt(value.data, 10) !== otp) return next(OTP_MISMATCH);
          // Dont wait for this response
          redisService.destroy(criteria);
          return next(null, user);
        })
        .catch(next);
      },
      function generateToken(user, next) {
        return AccessToken.create({
          userId: user.id,
          device: meta && meta.device
        })
        .then(newRecord => {
          return next(null, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            contact: user.contact,
            description: user.description,
            email: user.email,
            roles: user.roles,
            accessToken: newRecord.token
          });
        })
        .catch(next);
      }
    ], (err, user) => {
      if (err) {
        return res.unAuthorized(err);
      }
      const { deviceId } = req.options;
      if (deviceId) {
        logger.info({
          action: 'update-subscription',
          data: user
        });
        notificationService.update({
          userId: user.id,
          userType: 'user',
          deviceId,
          token,
          contact: user.contact,
          firstName: user.firstName,
          status: 'loggedIn'
        })
        .then(logger.debug)
        .catch(logger.error);
      }
      return res.ok(user);
    });
  },

  signout: (req, res) => {
    AccessToken.destroy({
      where: {
        token: getToken(req)
      }
    })
    .then(affectedRows => {
      const { deviceId } = req.options;
      if (deviceId) {
        notificationService.update({
          deviceId,
          status: 'anon'
        })
        .then(logger.debug)
        .catch(logger.error);
      }
      return res.noContent(affectedRows);
    })
    .catch(res.serverError);
  },

  /**
   * Sends a One Time Password (OTP) for validating contact info
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  sendOTP: (req, res) => {
    const contact = req.params.contact;
    // const action = req.body.action || 'signup';
    let operationType = ACCOUNT_AUTHENTICATION;
    let operation = 'signin';
    async.waterfall([
      function checkIfContactExists(next) {
        // if (action === 'signin') return next();
        return User.findOne({
          where: {
            contact
          }
        })
        .then(record => {
          // if (!record) return next();
          // return res.status(409).send(CONTACT_ALREADY_REGISTERED);
          if (!record) {
            operation = 'signup';
            operationType = CONTACT_NUMBER_VERIFICATION;
          }
          return next();
        })
        .catch(next);
      },
      // Create a redis record
      function LogInRedis(next) {
        redisService.create({
          type: operationType,
          data: generateRandomNumber(),
          token: contact,
        })
        .then(value => next(null, value))
        .catch(next);
      },
      // send a message to that phone number
      function SendSMS(value, next) {
        // if storing in redis fails, bail out
        if (!value) {
          return res.negotiate();
        }

        logger.error({
          tag: 'info',
          controller: 'auth',
          action: 'sendOTP',
          data: value,
        });

        smsService.send(generateOTPTextMessage(value.data), contact)
        .then(response => next(null, value, response))
        .catch(next);
      }
    ], (err, result) => {
      if (err) {
        logger.error({
          tag: 'info',
          controller: 'auth',
          action: 'sendOTP',
          data: err,
        });
        return res.serverError(err);
      }
      const { type, data, token } = result;
      return res.ok({
        operation,
        type,
        data,
        token
      });
    });
  }
};
