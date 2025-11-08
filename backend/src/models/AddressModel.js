const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

        // Thông tin người nhận
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },

        // Địa chỉ chi tiết (tuỳ bạn tiêu chuẩn hoá theo tỉnh/huyện/xã)
        addressLine1: { type: String, required: true, trim: true }, // số nhà, đường
        addressLine2: { type: String, trim: true },                  // toà/ấp/thôn (nếu có)
        ward: { type: String, trim: true },
        district: { type: String, trim: true },
        province: { type: String, trim: true },
        country: { type: String, default: 'VN' },

        // Loại địa chỉ & cờ mặc định
        label: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
        isDefault: { type: Boolean, default: false },

        // Soft delete để không mất lịch sử
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// Đảm bảo mỗi user chỉ có 1 isDefault=true
addressSchema.pre('save', async function (next) {
    if (!this.isModified('isDefault')) return next();
    if (this.isDefault) {
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { $set: { isDefault: false } }
        );
    }
    next();
});

// Tiện ích setDefault
addressSchema.statics.setDefault = async function (userId, addressId) {
    await this.updateMany({ user: userId }, { $set: { isDefault: false } });
    await this.findByIdAndUpdate(addressId, { $set: { isDefault: true } });
    return this.findById(addressId);
};

module.exports = mongoose.model('Address', addressSchema);
