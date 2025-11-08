const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const { ROLE_TEMPLATES } = require('./RoleServices');

// Tạo admin account mới
const createAdminAccount = (adminData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, email, password, confirmPassword, phone, role, employeeInfo } = adminData;

            // Kiểm tra email đã tồn tại
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã được sử dụng'
                });
                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 8);

            // Lấy permissions theo role
            const roleTemplate = ROLE_TEMPLATES[role];
            if (!roleTemplate) {
                resolve({
                    status: 'ERR',
                    message: 'Role không hợp lệ'
                });
                return;
            }

            // Tạo admin account
            const newAdmin = await User.create({
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                isAdmin: true,
                role: role,
                permissions: roleTemplate.permissions,
                employeeInfo: {
                    employeeId: employeeInfo?.employeeId || `EMP${Date.now()}`,
                    department: employeeInfo?.department || '',
                    hireDate: employeeInfo?.hireDate || new Date(),
                    notes: employeeInfo?.notes || ''
                }
            });

            // Không trả về password
            const adminResponse = newAdmin.toObject();
            delete adminResponse.password;

            resolve({
                status: 'OK',
                message: 'Tạo tài khoản admin thành công',
                data: adminResponse
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy tất cả admin accounts
const getAllAdminAccounts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const admins = await User.find({ isAdmin: true })
                .select('-password -access_token -refresh_token')
                .sort({ createdAt: -1 });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: admins
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy chi tiết admin account
const getAdminById = (adminId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admin = await User.findOne({ _id: adminId, isAdmin: true })
                .select('-password -access_token -refresh_token');

            if (!admin) {
                resolve({
                    status: 'ERR',
                    message: 'Admin không tồn tại'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: admin
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật admin account
const updateAdminAccount = (adminId, updateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admin = await User.findOne({ _id: adminId, isAdmin: true });

            if (!admin) {
                resolve({
                    status: 'ERR',
                    message: 'Admin không tồn tại'
                });
                return;
            }

            // Nếu đổi role, cập nhật permissions theo role mới
            if (updateData.role && updateData.role !== admin.role) {
                const roleTemplate = ROLE_TEMPLATES[updateData.role];
                if (roleTemplate) {
                    updateData.permissions = roleTemplate.permissions;
                }
            }

            // Update
            const updatedAdmin = await User.findByIdAndUpdate(
                adminId,
                updateData, { new: true }
            ).select('-password -access_token -refresh_token');

            resolve({
                status: 'OK',
                message: 'Cập nhật thành công',
                data: updatedAdmin
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Xóa admin account (soft delete)
const deleteAdminAccount = (adminId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admin = await User.findOne({ _id: adminId, isAdmin: true });

            if (!admin) {
                resolve({
                    status: 'ERR',
                    message: 'Admin không tồn tại'
                });
                return;
            }

            // Không cho xóa super admin cuối cùng
            if (admin.role === 'super_admin') {
                const superAdminCount = await User.countDocuments({
                    isAdmin: true,
                    role: 'super_admin',
                    isLocked: false
                });

                if (superAdminCount <= 1) {
                    resolve({
                        status: 'ERR',
                        message: 'Không thể xóa Super Admin cuối cùng'
                    });
                    return;
                }
            }

            // Khóa tài khoản thay vì xóa
            admin.isLocked = true;
            await admin.save();

            resolve({
                status: 'OK',
                message: 'Đã khóa tài khoản admin'
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Đổi mật khẩu admin
const changeAdminPassword = (adminId, currentPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admin = await User.findOne({ _id: adminId, isAdmin: true });

            if (!admin) {
                resolve({
                    status: 'ERR',
                    message: 'Admin không tồn tại'
                });
                return;
            }

            // Kiểm tra mật khẩu hiện tại
            const isMatch = bcrypt.compareSync(currentPassword, admin.password);
            if (!isMatch) {
                resolve({
                    status: 'ERR',
                    message: 'Mật khẩu hiện tại không đúng'
                });
                return;
            }

            // Hash mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 8);
            admin.password = hashedPassword;
            await admin.save();

            resolve({
                status: 'OK',
                message: 'Đổi mật khẩu thành công'
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createAdminAccount,
    getAllAdminAccounts,
    getAdminById,
    updateAdminAccount,
    deleteAdminAccount,
    changeAdminPassword
};