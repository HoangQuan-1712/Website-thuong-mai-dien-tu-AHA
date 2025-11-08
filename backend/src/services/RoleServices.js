const ROLE_TEMPLATES = {
    super_admin: {
        name: 'Super Admin',
        description: 'Toàn quyền quản trị hệ thống',
        permissions: {
            canViewUsers: true,
            canCreateUsers: true,
            canUpdateUsers: true,
            canDeleteUsers: true,
            canViewProducts: true,
            canCreateProducts: true,
            canUpdateProducts: true,
            canDeleteProducts: true,
            canViewOrders: true,
            canUpdateOrders: true,
            canDeleteOrders: true,
            canAccessChat: true,
            canManageAdmins: true,
            canManageRoles: true
        }
    },
    support_staff: {
        name: 'Nhân viên Hỗ trợ',
        description: 'Chăm sóc khách hàng, xem đơn hàng',
        permissions: {
            canViewUsers: true,
            canCreateUsers: false,
            canUpdateUsers: false,
            canDeleteUsers: false,
            canViewProducts: true,
            canCreateProducts: false,
            canUpdateProducts: false,
            canDeleteProducts: false,
            canViewOrders: true,
            canUpdateOrders: false,
            canDeleteOrders: false,
            canAccessChat: true,
            canManageAdmins: false,
            canManageRoles: false
        }
    },
    warehouse_staff: {
        name: 'Nhân viên Kho',
        description: 'Quản lý đơn hàng, cập nhật trạng thái giao hàng',
        permissions: {
            canViewUsers: false,
            canCreateUsers: false,
            canUpdateUsers: false,
            canDeleteUsers: false,
            canViewProducts: true,
            canCreateProducts: false,
            canUpdateProducts: true,
            canDeleteProducts: false,
            canViewOrders: true,
            canUpdateOrders: true,
            canDeleteOrders: false,
            canAccessChat: false,
            canManageAdmins: false,
            canManageRoles: false
        }
    },
    content_staff: {
        name: 'Nhân viên Content',
        description: 'Quản lý sản phẩm, nội dung',
        permissions: {
            canViewUsers: false,
            canCreateUsers: false,
            canUpdateUsers: false,
            canDeleteUsers: false,
            canViewProducts: true,
            canCreateProducts: true,
            canUpdateProducts: true,
            canDeleteProducts: false,
            canViewOrders: false,
            canUpdateOrders: false,
            canDeleteOrders: false,
            canAccessChat: false,
            canManageAdmins: false,
            canManageRoles: false
        }
    }
};

// Lấy tất cả role templates
const getAllRoleTemplates = () => {
    return new Promise((resolve) => {
        const roles = Object.keys(ROLE_TEMPLATES).map(key => ({
            key: key,
            ...ROLE_TEMPLATES[key]
        }));

        resolve({
            status: 'OK',
            message: 'SUCCESS',
            data: roles
        });
    });
};

// Lấy permissions theo role
const getPermissionsByRole = (roleKey) => {
    return new Promise((resolve) => {
        const roleTemplate = ROLE_TEMPLATES[roleKey];

        if (!roleTemplate) {
            resolve({
                status: 'ERR',
                message: 'Role không tồn tại'
            });
            return;
        }

        resolve({
            status: 'OK',
            message: 'SUCCESS',
            data: roleTemplate.permissions
        });
    });
};

// Cập nhật custom permissions cho user
const updateUserPermissions = async(userId, permissions) => {
    const User = require('../models/UserModel');

    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User không tồn tại'
                });
                return;
            }

            if (!user.isAdmin) {
                resolve({
                    status: 'ERR',
                    message: 'User không phải admin'
                });
                return;
            }

            user.permissions = {...user.permissions, ...permissions };
            await user.save();

            resolve({
                status: 'OK',
                message: 'Cập nhật quyền thành công',
                data: user
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    ROLE_TEMPLATES,
    getAllRoleTemplates,
    getPermissionsByRole,
    updateUserPermissions
};