const mongoose = require('mongoose');

// Schema cho discount theo thời gian
const DiscountPeriodSchema = new mongoose.Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        percent: { type: Number, required: true, min: 0, max: 100 }
    },
    { _id: false }
);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, default: '' },

    // SỬA: Dùng Mixed type để hỗ trợ cả Number và Object
    discount: {
        type: mongoose.Schema.Types.Mixed,
        default: 0,
        validate: {
            validator: function (value) {
                // Cho phép: number, object có cấu trúc đúng, hoặc null/undefined
                if (value === null || value === undefined) return true;
                if (typeof value === 'number') return value >= 0 && value <= 100;
                if (typeof value === 'object') {
                    return value.startDate && value.endDate &&
                        typeof value.percent === 'number' &&
                        value.percent >= 0 && value.percent <= 100;
                }
                return false;
            },
            message: 'Discount phải là số từ 0-100 hoặc object có startDate, endDate, percent'
        }
    },

    // Bỏ comment discounts array
    discounts: [DiscountPeriodSchema],

    selled: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;