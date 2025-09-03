const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const genneralAccessToken = async(payload) => {
    console.log('payload', payload);

    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, {
        expiresIn: '30s'
    })
    return access_token
}

const genneralRefreshToken = async(payload) => {

    const refresh_token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, {
        expiresIn: '365d'
    })
    return refresh_token
}

const refreshTokenJwtService = async(token) => {
    return new Promise(async(resolve, reject) => {
        try {
            console.log('token', token)
            jwt.verify(token, process.env.REFRESH_TOKEN, async(err, user) => {
                if (err || !user) {
                    resolve({
                        status: 'ERR',
                        message: 'The refresh token is not valid'
                    })
                }
                console.log('user', user)
                const { payload } = user
                const access_token = await genneralAccessToken({
                    id: payload && payload.id,
                    isAdmin: payload && payload.isAdmin
                })
                console.log('access_token', access_token)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                })
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}