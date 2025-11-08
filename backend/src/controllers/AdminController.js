const AdminServices = require('../services/AdminServices');

const createAdminAccount = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, role, employeeInfo } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu không khớp'
            });
        }

        const response = await AdminServices.createAdminAccount(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getAllAdminAccounts = async (req, res) => {
    try {
        const response = await AdminServices.getAllAdminAccounts();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getAdminById = async (req, res) => {
    try {
        const adminId = req.params.id;
        const response = await AdminServices.getAdminById(adminId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const updateAdminAccount = async (req, res) => {
    try {
        const adminId = req.params.id;
        const updateData = req.body;

        const response = await AdminServices.updateAdminAccount(adminId, updateData);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const deleteAdminAccount = async (req, res) => {
    try {
        const adminId = req.params.id;
        const response = await AdminServices.deleteAdminAccount(adminId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        const response = await AdminServices.changeAdminPassword(adminId, currentPassword, newPassword);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    createAdminAccount,
    getAllAdminAccounts,
    getAdminById,
    updateAdminAccount,
    deleteAdminAccount,
    changeAdminPassword
};