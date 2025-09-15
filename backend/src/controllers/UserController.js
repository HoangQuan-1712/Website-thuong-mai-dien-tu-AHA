const UserServices = require('../services/UserServices')
const JwtServices = require('../services/JwtServices')

const createUser = async(req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
            // Chỉ bắt buộc email, password, confirmPassword; name/phone là tùy chọn
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password  is equal confirmPassword'
            })
        }
        console.log('isCheckEmail', isCheckEmail);
        const response = await UserServices.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email and password are required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            })
        }

        console.log('isCheckEmail', isCheckEmail);
        const response = await UserServices.loginUser({ email, password })
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        })
    }
}

const updateUser = async(req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserServices.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id
            //const token = req.headers

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserServices.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getAllUser = async(req, res) => {
    try {
        const { limit, page } = req.query;
        const response = await UserServices.getAllUser(Number(limit) || 8, Number(page) || 0)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getDetailsUser = async(req, res) => {
    try {
        const userId = req.params.id
            //const token = req.headers

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserServices.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const refreshToken = async(req, res) => {
    try {
        console.log('Headers:', req.headers);
        console.log('Raw token header:', req.headers.token);

        // Kiểm tra token có tồn tại không
        if (!req.headers.token) {
            return res.status(401).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }

        // Xử lý token từ header - xử lý nhiều trường hợp
        let token = req.headers.token;

        // Loại bỏ khoảng trắng thừa
        token = token.trim();

        // Xử lý trường hợp có nhiều token (lấy token cuối cùng)
        if (token.includes('Bearer') && token.includes('eyJ')) {
            // Tìm token JWT cuối cùng
            const jwtMatches = token.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g);
            if (jwtMatches && jwtMatches.length > 0) {
                token = jwtMatches[jwtMatches.length - 1]; // Lấy token cuối cùng
            }
        } else if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        } else if (token.startsWith('Beare ')) {
            // Xử lý trường hợp typo "Beare"
            token = token.split(' ')[1];
        } else if (token.includes(' ')) {
            // Nếu có khoảng trắng, lấy phần cuối
            const parts = token.split(' ');
            token = parts[parts.length - 1];
        }

        // Loại bỏ ký tự không hợp lệ ở đầu/cuối
        token = token.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+$/, '');

        console.log('Processed token:', token);

        if (!token || token.length < 10) {
            return res.status(401).json({
                status: 'ERR',
                message: 'Invalid token format'
            })
        }

        const response = await JwtServices.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        console.error('Refresh token error:', e);
        return res.status(401).json({
            status: 'ERR',
            message: e.message || 'Token refresh failed'
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}