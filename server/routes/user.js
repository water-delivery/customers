const express = require('express');

const router = express.Router();
const {
  loadUser,
  isAdmin,
  validations,
} = require('../policies');
const userController = require('../controllers/user');

/* Get logged in user */
router.get('/user/me', loadUser, userController.findMe);

/* Get all users */
router.get('/users', loadUser, isAdmin, userController.findAll);

/* */
router.get('/user/:username', loadUser, userController.findOne);

/* */
router.put('/user', loadUser, validations.update, userController.update);

module.exports = router;
