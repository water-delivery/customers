const express = require('express');
const {
  loadUser,
  loadAddress
} = require('../policies');

const router = express.Router();
const addressController = require('../controllers/address');

/* Create new address */
router.post('/address', loadUser, addressController.create);

/* update */
router.put('/address/:id', loadUser, loadAddress, addressController.update);

/* delete */
router.delete('/address/:id', loadUser, loadAddress, addressController.delete);

/* Get all user addresses */
router.get('/addresses', loadUser, addressController.findAll);

module.exports = router;
