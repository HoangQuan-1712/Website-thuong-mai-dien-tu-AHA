const UserServices = require('../services/UserServices')
const JwtServices = require('../services/JwtServices')

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            return res.status(200).json({ status: 'ERR', message: 'The input is required' });
        } else if (!isCheckEmail) {
            return res.status(200).json({ status: 'ERR', message: 'The input is email' });
        } else if (password !== confirmPassword) {
            return res.status(200).json({ status: 'ERR', message: 'The password is equal confirmPassword' });
        }

        const response = await UserServices.createUser(req.body);
        if (response && response.status === 'OK' && response.refresh_token) {
            res.cookie('refresh_token', response.refresh_token, {
                httpOnly: true,
                secure: false,  // Fix: false cho dev
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            // Ẩn refresh_token khỏi response
            return res.status(200).json({
                status: 'OK',
                message: 'SUCCESS',
                data: response.data,
                access_token: response.access_token
            });
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(400).json({ status: 'ERR', message: 'Email and password are required' });
        } else if (!isCheckEmail) {
            return res.status(400).json({ status: 'ERR', message: 'Invalid email format' });
        }

        const response = await UserServices.loginUser(req.body);
        if (response && response.status === 'OK' && response.refresh_token) {
            res.cookie('refresh_token', response.refresh_token, {
                httpOnly: true,
                secure: false,  // Fix: false cho dev/localhost (HTTP), true cho prod (HTTPS)
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
            });
            // Ẩn refresh_token khỏi response
            return res.status(200).json({
                status: 'OK',
                message: 'SUCCESS',
                access_token: response.access_token
            });
        }
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};


const updateUser = async (req, res) => {
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

const deleteUser = async (req, res) => {
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

const getAllUser = async (req, res) => {
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

const getDetailsUser = async (req, res) => {
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

const refreshToken = async (req, res) => {
    try {
        let token = req.cookies?.refresh_token || req.headers?.authorization?.replace('Bearer ', '') || req.body?.refresh_token || '';
        if (!token) {
            return res.status(401).json({ status: 'ERR', message: 'Refresh token is required' });
        }

        token = token.trim().replace(/^[^A-Za-z0-9-_.]+|[^A-Za-z0-9-_.]+$/g, '');

        const response = await JwtServices.refreshTokenJwtService(token);
        if (response.status !== 'OK') {
            res.clearCookie('refresh_token', { path: '/' });
        }
        return res.status(200).json(response);
    } catch (e) {
        res.clearCookie('refresh_token', { path: '/' });
        return res.status(401).json({ status: 'ERR', message: e.message || 'Token refresh failed' });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token', { path: '/' });
        return res.status(200).json({
            status: 'OK',
            message: 'logout suscessfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e.message
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
    refreshToken,
    logoutUser
}