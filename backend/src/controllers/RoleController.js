const RoleServices = require('../services/RoleServices');

const getAllRoleTemplates = async (req, res) => {
    try {
        const response = await RoleServices.getAllRoleTemplates();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getPermissionsByRole = async (req, res) => {
    try {
        const { roleKey } = req.params;
        const response = await RoleServices.getPermissionsByRole(roleKey);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const updateUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const { permissions } = req.body;

        const response = await RoleServices.updateUserPermissions(userId, permissions);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    getAllRoleTemplates,
    getPermissionsByRole,
    updateUserPermissions
};