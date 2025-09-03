const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require("./JwtServices")

const createUser = (newUser) => {
    return new Promise(async(resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {

            // Kiểm tra JWT_SECRET
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET không được định nghĩa trong biến môi trường");
            }

            const hashedPassword = await bcrypt.hash(password, 8);
            const access_token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            const refresh_token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'OK',
                    message: 'The email is already'
                })
            }

            const createdUser = await User.create({
                name,
                email,
                password: hashedPassword,
                confirmPassword: hashedPassword,
                phone,
                access_token,
                refresh_token
            })

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser

                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async(resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = userLogin
        try {

            // Kiểm tra JWT_SECRET
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET không được định nghĩa trong biến môi trường");
            }
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            console.log('comparePassword', comparePassword)
            if (!comparePassword) {
                resolve({
                    status: 'OK',
                    message: 'the password or user is incorrect'
                })
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token

            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'delete user success'
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const allUser = await User.find()

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })

        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
}