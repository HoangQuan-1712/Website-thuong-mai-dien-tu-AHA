const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res, next) => {
    console.log('checkToken', req.headers.token);

    // Kiểm tra token có tồn tại không
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        })
    }

    // Xử lý token tương tự như refreshToken
    let token = req.headers.token.trim();

    if (token.includes('Bearer') && token.includes('eyJ')) {
        const jwtMatches = token.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g);
        if (jwtMatches && jwtMatches.length > 0) {
            token = jwtMatches[jwtMatches.length - 1];
        }
    } else if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    } else if (token.startsWith('Beare ')) {
        token = token.split(' ')[1];
    } else if (token.includes(' ')) {
        const parts = token.split(' ');
        token = parts[parts.length - 1];
    }

    token = token.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+$/, '');

    console.log('Processed token for auth:', token);

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(401).json({
                message: 'The authentication failed',
                status: 'ERROR'
            })
        }

        const { payload } = user
        if (payload && payload.isAdmin) {
            next()
        } else {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required',
                status: 'ERROR'
            })
        }
    })
}

const authUserMiddleware = (req, res, next) => {
    console.log('checkToken', req.headers.token);

    // Kiểm tra token có tồn tại không
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        })
    }

    // Xử lý token tương tự như refreshToken
    let token = req.headers.token.trim();

    if (token.includes('Bearer') && token.includes('eyJ')) {
        const jwtMatches = token.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g);
        if (jwtMatches && jwtMatches.length > 0) {
            token = jwtMatches[jwtMatches.length - 1];
        }
    } else if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    } else if (token.startsWith('Beare ')) {
        token = token.split(' ')[1];
    } else if (token.includes(' ')) {
        const parts = token.split(' ');
        token = parts[parts.length - 1];
    }

    token = token.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+$/, '');

    console.log('Processed token for user auth:', token);

    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(401).json({
                message: 'The authentication failed',
                status: 'ERROR'
            })
        }

        const { payload } = user
        if ((payload && payload.isAdmin) || (payload && payload.id === userId)) {
            next()
        } else {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required',
                status: 'ERROR'
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}