const User = require('../models').user;
const AccessToken = require('../models').accessToken;
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
  signup: function (req, res) {
    const { firstName, lastName, password, contact, description, email, meta } = req.body;
    // All validations should be done by now!
    // TODO: Get other possible information from the device he is logging in!
    console.log(req.body);
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
      function createUser(next) {
        User.create(userObject)
        .then(record => {
          return next(null, record);
        })
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
          })
        })
        .catch(next)
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

  signin: function (req, res) {
    // All validations should be done by now!
    const { contact, password, meta } = req.body;
    return async.waterfall([
      function findUser(next) {
        User.findOne({ where: { contact } })
        .then(user => {
          if (!user) return res.status(404).send(validations.USER_NOT_FOUND);
          return next(null, user);
        })
        .catch(console.log);
      },
      function validatePassword(user, next) {
        return User.validatePassword(password, user.password)
          .then(isValid => {
            if (isValid) return next(null, user);
            return res.status(401).send(validations.PASSWORD_NOT_MATCHED);
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
        .catch(console.log);
      }
    ], (err, user) => {
      if (err) {
        return res.status(401).send()
      }
      return res.status(200).send(user)
    });
  },

  signout: function (req, res) {
  },
}
