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

    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authentication',
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

    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authentication',
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