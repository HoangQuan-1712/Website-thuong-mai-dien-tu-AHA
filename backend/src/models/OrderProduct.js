const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    orderItems: [{
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },],

    shippingAddressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },

    shippingAddress: {
        // snapshot từ Address tại thời điểm đặt hàng
        fullName: { type: String, required: true },   // tên người nhận -> lấy từ Address.fullName
        phone: { type: String, required: true },   // lưu dạng String
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        ward: { type: String },
        district: { type: String },
        province: { type: String, required: true },
        country: { type: String, default: 'VN' },
        // Tuỳ chọn: chuỗi gộp để hiển thị nhanh
        addressText: { type: String } // addressLine1, addressLine2, ward, district, province
    },

    paymentMethod: { type: String, required: true },    // camelCase cho thống nhất
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order