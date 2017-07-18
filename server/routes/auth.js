const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAdmin,
  validations,
} = require('../policies');
const authController = require('../controllers/auth');

/* Create user */
router.post('/auth/signup', validations.create, authController.signup);

/* Signin */
router.post('/auth/signin', authController.signin);

/* Signin */
router.post('/auth/signout', authController.signout);


module.exports = router;
