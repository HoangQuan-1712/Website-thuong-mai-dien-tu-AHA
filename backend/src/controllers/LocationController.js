const LocationServices = require('../services/LocationServices');

const getAllProvinces = async (req, res) => {
    try {
        const response = await LocationServices.getAllProvinces();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getDistrictsByProvince = async (req, res) => {
    try {
        const { provinceCode } = req.params;
        const response = await LocationServices.getDistrictsByProvince(provinceCode);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getWardsByDistrict = async (req, res) => {
    try {
        const { districtCode } = req.params;
        const response = await LocationServices.getWardsByDistrict(districtCode);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    getAllProvinces,
    getDistrictsByProvince,
    getWardsByDistrict
};