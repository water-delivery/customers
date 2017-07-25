const express = require('express');
const router = express.Router();
const {
  loadUser,
  isAdmin,
  validations,
} = require('../policies');
const authController = require('../controllers/auth');

/* Create user */
router.post('/signup', validations.create, authController.signup);

/* Signin */
router.post('/signin', authController.signin);

/* Signin */
router.post('/signout', authController.signout);


module.exports = router;
