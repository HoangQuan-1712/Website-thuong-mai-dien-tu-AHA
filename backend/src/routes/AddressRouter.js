const express = require("express");
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const { authUserMiddleware } = require('../middleware/authMiddleware');


router.post('/create', authUserMiddleware, AddressController.createAddress);
router.get('/get-all', authUserMiddleware, AddressController.getAllAddresses);
router.get('/get-details/:id', authUserMiddleware, AddressController.getAddressById);
router.put('/update/:id', authUserMiddleware, AddressController.updateAddress);
router.put('/set-default/:id', authUserMiddleware, AddressController.setDefaultAddress);
router.delete('/delete/:id', authUserMiddleware, AddressController.deleteAddress);

module.exports = router;