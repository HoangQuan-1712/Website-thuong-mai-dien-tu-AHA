const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const genneralAccessToken = async (payload) => {
    console.log('payload', payload);

    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, {
        expiresIn: '30s'
    })
    return access_token
}

const genneralRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, {
        expiresIn: '365d'
    })
    return refresh_token
}

const refreshTokenJwtService = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('token', token)

            // Kiểm tra REFRESH_TOKEN có tồn tại không
            if (!process.env.REFRESH_TOKEN) {
                reject(new Error('REFRESH_TOKEN không được định nghĩa trong biến môi trường'))
                return
            }

            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.error('JWT verification error:', err.message)
                    resolve({
                        status: 'ERR',
                        message: 'The refresh token is not valid or expired'
                    })
                    return
                }

                if (!user || (!user.id && !user._id)) {
                    resolve({
                        status: 'ERR',
                        message: 'Invalid token payload'
                    })
                    return
                }


                try {
                    const access_token = await genneralAccessToken({
                        id: user.id || user._id,
                        isAdmin: user.isAdmin
                    })

                    console.log('access_token', access_token)
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        access_token
                    })
                } catch (tokenError) {
                    console.error('Error generating access token:', tokenError)
                    resolve({
                        status: 'ERR',
                        message: 'Failed to generate access token'
                    })
                }
            })

        } catch (e) {
            console.error('Refresh token service error:', e)
            reject(e)
        }
    })
}



module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}