// const async = require('async');
const faker = require('faker');
const User = require('../../server/models').user;
const { generateRandomNumber } = require('../../server/utils');

const AccessToken = require('../../server/models').accessToken;

// module.exports = (extension = {}, done) => {
//   const userObject = Object.assign({
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//     contact: generateRandomNumber(10),
//     description: faker.lorem.sentence(),
//     email: faker.internet.email()
//   }, extension);

//   return async.waterfall([
//     function createUser(next) {
//       return User.create(userObject)
//       .then(record => next(null, record))
//       .catch(next);
//     },
//     function issueAccessToken(user, next) {
//       AccessToken.create({
//         userId: user.id
//       })
//       .then(newToken => next(null, {
//         firstName: user.firstName,
//         lastName: user.lastName,
//         avatar: user.avatar,
//         contact: user.contact,
//         description: user.description,
//         email: user.email,
//         roles: user.roles,
//         accessToken: newToken.token
//       }))
//       .catch(next);
//     },
//   ], (error, user) => {
//     console.log(user);
//     return new Promise((resolve, reject) => {
//       if (error) return reject(error);
//       return resolve(user);
//     });
//   });
// };


module.exports = (extension = {}) => {
  return User.create(Object.assign({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    contact: generateRandomNumber(10),
    description: faker.lorem.sentence(),
    email: faker.internet.email()
  }, extension))
  .then(user => {
    AccessToken.create({
      userId: user.id
    })
    .then(newToken =>
      new Promise((resolve) => resolve({
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        contact: user.contact,
        description: user.description,
        email: user.email,
        roles: user.roles,
        accessToken: newToken.token
      }))
    );
  });
};
