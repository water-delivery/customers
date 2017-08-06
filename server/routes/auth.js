const express = require('express');
const {
  isAdmin,
  isServiceAccount,
  validations,
} = require('../policies');

const router = express.Router();
const authController = require('../controllers/auth');

/* Create user */
router.post('/signup', validations.create, authController.signup);

/* Signin */
router.post('/signin', authController.signin);

/* Signin */
router.delete('/signout/:deviceId', authController.signout);

/* Accepts contact as params and send OTP to client */
router.post('/otp/:contact', isServiceAccount, authController.sendOTP);

module.exports = router;
