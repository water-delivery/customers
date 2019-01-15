const sinon = require('sinon');
const request = require('supertest');
// const should = require('chai').should();
const userFactory = require('../../factories/user');

const app = require('../../../app');

describe('User', () => {
  let user;
  before((done) => {
    async.series([
      // mock third party api services here
      next => {
        sinon.stub(sails.services.shelfservice, 'fetchFollowingBooks',
        function fetchFollowingBooksStub(options, cb) {
          if (typeof cb === 'function') return cb();
          return {};
        });
      },
      // create required data
      next => {
        userFactory()
        .then(model => {
          user = model;
          console.log('=======>', user);
          done();
        });
      }
    ], done);
  });

  it('Get user info', (done) => {
    request(app)
    .get('/auth/v1/user/me')
    .set('Authorization', `Bearer ${user.accessToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) throw err;
      console.log(res.body);
      done();
    });
    return done();
  });
});

