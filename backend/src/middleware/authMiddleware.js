const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
dotenv.config();

const authMiddleware = async(req, res, next) => {
    // Lấy token từ header 'token' hoặc 'authorization'
    let token = req.headers.token || req.headers.authorization;

    // Nếu không có token, trả về lỗi
    if (!token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        });
    }

    // Nếu token bắt đầu bằng 'Bearer ', lấy phần token thực tế
    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN, async(err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'The authentication failed',
                status: 'ERROR'
            });
        }
        req.user = user;
        try {
            const userDoc = await User.findById(user.id);
            if (userDoc && userDoc.isLocked && !userDoc.isAdmin) {
                return res.status(403).json({
                    message: 'Tài khoản của bạn đã bị khóa',
                    status: 'ERROR'
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Error checking user status',
                status: 'ERROR'
            });
        }

        // Chỉ cho phép admin
        if (user.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required',
                status: 'ERROR'
            });
        }
    });
};

const authUserMiddleware = async(req, res, next) => {
    // Lấy token từ header 'token' hoặc 'authorization'
    let token = req.headers.token || req.headers.authorization;

    // Nếu không có token, trả về lỗi
    if (!token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        });
    }

    // Nếu token bắt đầu bằng 'Bearer ', lấy phần token thực tế
    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN, async(err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'The authentication failed',
                status: 'ERROR'
            });
        }
        req.user = user;
        try {
            const userDoc = await User.findById(user.id);
            if (userDoc && userDoc.isLocked && !userDoc.isAdmin) {
                return res.status(403).json({
                    message: 'Tài khoản của bạn đã bị khóa',
                    status: 'ERROR'
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Error checking user status',
                status: 'ERROR'
            });
        }

        // Kiểm tra quyền: Cho phép nếu là admin hoặc user id khớp với params
        const userId = req.params.id;
        if (user.isAdmin || (user.id && user.id === userId)) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied. User privileges required',
                status: 'ERROR'
            });
        }
    });
};

module.exports = {
    authMiddleware,
    authUserMiddleware
};