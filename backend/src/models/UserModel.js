// models/UserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {

        username: { type: String, trim: true, default: '' },

        name: { type: String, required: false, default: '' },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },


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


    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
