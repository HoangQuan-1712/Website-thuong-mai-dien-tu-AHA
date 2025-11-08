const express = require("express");
const router = express.Router();
const LocationController = require('../controllers/LocationController');

router.get('/provinces', LocationController.getAllProvinces);
router.get('/districts/:provinceCode', LocationController.getDistrictsByProvince);
router.get('/wards/:districtCode', LocationController.getWardsByDistrict);

module.exports = router;