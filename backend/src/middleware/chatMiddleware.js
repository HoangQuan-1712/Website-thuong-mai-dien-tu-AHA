const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
dotenv.config();

/**
 * Middleware dành riêng cho Chat
 * Cho phép TẤT CẢ user đã đăng nhập (không cần kiểm tra params.id)
 */
const authChatMiddleware = async (req, res, next) => {
    let token = req.headers.token || req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
        if (err) {
            console.error('❌ Token verification failed:', err.message);
            return res.status(401).json({
                message: 'The authentication failed',
                status: 'ERROR'
            });
        }

        req.user = user;

        try {
            const userDoc = await User.findById(user.id);

            if (!userDoc) {
                return res.status(404).json({
                    message: 'User không tồn tại',
                    status: 'ERROR'
                });
            }

            if (userDoc.isLocked && !userDoc.isAdmin) {
                return res.status(403).json({
                    message: 'Tài khoản của bạn đã bị khóa',
                    status: 'ERROR'
                });
            }

            // ✅ Cho phép TẤT CẢ user đã login
            console.log(`✅ Chat access granted for user: ${user.id}, isAdmin: ${user.isAdmin}`);
            next();

        } catch (error) {
            console.error('❌ Error checking user:', error);
            return res.status(500).json({
                message: 'Error checking user status',
                status: 'ERROR'
            });
        }
    });
};

module.exports = { authChatMiddleware };
