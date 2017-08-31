const express = require('express');

const router = express.Router();
const {
  loadUser,
  isAdmin,
} = require('../policies');
const userController = require('../controllers/user');

/* Get logged in user */
router.get('/user/me', loadUser, userController.findMe);

/* Get all users */
router.get('/users', loadUser, isAdmin, userController.findAll);

/* */
router.get('/user/:username', loadUser, userController.findOne);

/* Update active address */
// router.put('/user/address', loadUser, loadAddress, userController.updateAddress);

/* Update user information */
router.put('/user', loadUser, userController.update);

module.exports = router;
