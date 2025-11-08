const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, trim: true, default: '' },
    name: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Admin & Role System
    isAdmin: { type: Boolean, default: false, required: true },
    role: {
        type: String,
        enum: ['customer', 'super_admin', 'support_staff', 'warehouse_staff', 'content_staff'],
        default: 'customer'
    },

    // Permissions - Chỉ dùng cho admin accounts
    permissions: {
        // User Management
        canViewUsers: { type: Boolean, default: false },
        canCreateUsers: { type: Boolean, default: false },
        canUpdateUsers: { type: Boolean, default: false },
        canDeleteUsers: { type: Boolean, default: false },

        // Product Management
        canViewProducts: { type: Boolean, default: false },
        canCreateProducts: { type: Boolean, default: false },
        canUpdateProducts: { type: Boolean, default: false },
        canDeleteProducts: { type: Boolean, default: false },

        // Order Management
        canViewOrders: { type: Boolean, default: false },
        canUpdateOrders: { type: Boolean, default: false },
        canDeleteOrders: { type: Boolean, default: false },

        // Chat/Support
        canAccessChat: { type: Boolean, default: false },

        // Admin Management
        canManageAdmins: { type: Boolean, default: false },
        canManageRoles: { type: Boolean, default: false },
    },

    phone: { type: String, required: false, default: null },
    access_token: { type: String, required: false },
    refresh_token: { type: String, required: false },
    defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
    avatar: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    dob: {
        day: { type: Number, min: 1, max: 31, default: null },
        month: { type: Number, min: 1, max: 12, default: null },
        year: { type: Number, min: 1900, max: 2100, default: null },
    },
    isLocked: { type: Boolean, default: false },

    // Thông tin nhân viên (chỉ cho admin accounts)
    employeeInfo: {
        employeeId: { type: String },
        department: { type: String },
        hireDate: { type: Date },
        notes: { type: String }
    }
}, { timestamps: true });

// Middleware: Tự động set permissions khi tạo Super Admin
userSchema.pre('save', function (next) {
    if (this.role === 'super_admin') {
        this.permissions = {
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
        };
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;