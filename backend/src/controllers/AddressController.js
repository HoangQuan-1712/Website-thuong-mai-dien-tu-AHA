const AddressServices = require('../services/AddressServices');

const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressData = req.body;

        if (!addressData.fullName || !addressData.phone || !addressData.addressLine1) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        const response = await AddressServices.createAddress(userId, addressData);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};


const getAllAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await AddressServices.getAllAddresses(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getAddressById = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const response = await AddressServices.getAddressById(addressId, userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};


const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const updateData = req.body;

        const response = await AddressServices.updateAddress(addressId, userId, updateData);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};


const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;

        const response = await AddressServices.setDefaultAddress(addressId, userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};


const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;

        const response = await AddressServices.deleteAddress(addressId, userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    createAddress,
    getAllAddresses,
    getAddressById,
    updateAddress,
    setDefaultAddress,
    deleteAddress
};