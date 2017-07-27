const async = require('async');
const User = require('../models').user;
const AccessToken = require('../models').accessToken;
const redisService = require('../services').redis;
const smsService = require('../services').sms;
const { generateRandomNumber, generateOTPTextMessage } = require('../utils');
const {
  CONTACT_NUMBER_VERIFICATION,
  USER_NOT_FOUND,
  PASSWORD_NOT_MATCHED,
  CONTACT_ALREADY_REGISTERED,
  INVALID_OTP,
  OTP_MISMATCH
} = require('../constants');

module.exports = {
  signup: (req, res) => {
    const { firstName, lastName, password, otp, contact, description, email, meta } = req.body;
    // All validations should be done by now!
    // TODO: Get other possible information from the device he is logging in!
    const userObject = {
      firstName,
      lastName,
      password,
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
          if (value.data !== otp) return next(OTP_MISMATCH);
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
        .then(newToken => {
          return next(null, {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            contact: user.contact,
            description: user.description,
            email: user.email,
            roles: user.roles,
            accessToken: newToken.token
          });
        })
        .catch(next);
      },
    ], function final(error, user) {
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
      return res.status(201).send(user);
    });
  },

  signin: (req, res) => {
    // All validations should be done by now!
    const { contact, password, meta } = req.body;
    return async.waterfall([
      function findUser(next) {
        User.findOne({ where: { contact } })
        .then(user => {
          if (!user) return res.status(404).send(USER_NOT_FOUND);
          return next(null, user);
        })
        .catch(next);
      },
      function validatePassword(user, next) {
        return User.validatePassword(password, user.password)
          .then(isValid => {
            if (isValid) return next(null, user);
            return res.status(401).send(PASSWORD_NOT_MATCHED);
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
        return res.status(401).send(err);
      }
      return res.status(200).send(user);
    });
  },

  signout: (req, res) => res.status(200).send({}),

  /**
   * Sends a One Time Password (OTP) for validating contact info
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  sendOTP: (req, res) => {
    const contact = req.params.contact;
    const action = req.body.action || 'signup';
    async.waterfall([
      function checkIfContactExists(next) {
        if (action === 'signin') return next();
        return User.findOne({
          where: {
            contact
          }
        })
        .then(record => {
          if (!record) return next();
          return res.status(409).send(CONTACT_ALREADY_REGISTERED);
        })
        .catch(next);
      },
      // Create a redis record
      function LogInRedis(next) {
        redisService.create({
          type: CONTACT_NUMBER_VERIFICATION,
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

        smsService.send(generateOTPTextMessage(value.data), contact)
        .then(response => next(null, value, response))
        .catch(next);
      }
    ], (err, result) => res.ok(result));
  }
};
