const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require("./JwtServices")

// const createUser = (newUser) => {
//     return new Promise(async (resolve, reject) => {
//         const { name, email, password, confirmPassword, phone } = newUser
//         try {

//             // Kiểm tra JWT_SECRET
//             if (!process.env.JWT_SECRET) {
//                 throw new Error("JWT_SECRET không được định nghĩa trong biến môi trường");
//             }

//             const hashedPassword = await bcrypt.hash(password, 8);
//             const access_token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
//             const refresh_token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

//             const checkUser = await User.findOne({
//                 email: email
//             })
//             if (checkUser !== null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The email is already'
//                 })
//                 return
//             }

//             const createdUser = await User.create({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 confirmPassword: hashedPassword,
//                 phone,
//                 access_token,
//                 refresh_token
//             })

//             if (createdUser) {
//                 resolve({
//                     status: 'OK',
//                     message: 'SUCCESS',
//                     data: createdUser

//                 })
//             }

//         } catch (e) {
//             reject(e)
//         }
//     })
// }



// const loginUser = (userLogin) => {
//     return new Promise(async (resolve, reject) => {
//         const { email, password } = userLogin
//         try {

//             // Kiểm tra JWT_SECRET
//             if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
//                 throw new Error("JWT tokens không được định nghĩa trong biến môi trường");
//             }

//             const checkUser = await User.findOne({
//                 email: email
//             })

//             if (checkUser === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The user is not defined'
//                 })
//                 return
//             }

//             const comparePassword = bcrypt.compareSync(password, checkUser.password)
//             console.log('comparePassword', comparePassword)

//             if (!comparePassword) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The password or user is incorrect'
//                 })
//                 return
//             }

//             const access_token = await genneralAccessToken({
//                 id: checkUser.id,
//                 isAdmin: checkUser.isAdmin
//             })

//             const refresh_token = await genneralRefreshToken({
//                 id: checkUser.id,
//                 isAdmin: checkUser.isAdmin
//             })

//             resolve({
//                 status: 'OK',
//                 message: 'SUCCESS',
//                 access_token,
//                 refresh_token
//             })

//         } catch (e) {
//             reject(e)
//         }
//     })
// }

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
                throw new Error("JWT tokens không được định nghĩa trong biến môi trường");
            }

            const checkUser = await User.findOne({ email: email });
            if (checkUser !== null) {
                return resolve({ status: 'ERR', message: 'The email is already' });
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const access_token = await genneralAccessToken({ id: null, isAdmin: false }); // Tạo temp, sau update id
            const refresh_token = await genneralRefreshToken({ id: null, isAdmin: false });

            const createdUser = await User.create({
                name, email, password: hashedPassword, confirmPassword: hashedPassword, phone
                // Không lưu token vào DB nữa
            });

            // Update payload với id thực
            const access_token_final = await genneralAccessToken({ id: createdUser._id, isAdmin: createdUser.isAdmin });
            const refresh_token_final = await genneralRefreshToken({ id: createdUser._id, isAdmin: createdUser.isAdmin });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdUser,
                access_token: access_token_final,
                refresh_token: refresh_token_final
            });
        } catch (e) {
            reject(e);
        }
    });
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
                throw new Error("JWT tokens không được định nghĩa trong biến môi trường");
            }

            const checkUser = await User.findOne({ email: email });
            if (!checkUser) {
                return resolve({ status: 'ERR', message: 'The user is not defined' });
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return resolve({ status: 'ERR', message: 'The password or user is incorrect' });
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);
        }
    });
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
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

const getAllUser = (limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalUser = await User.estimatedDocumentCount()
            const allUser = await User.find().limit(limit).skip(page * limit)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser,
                total: totalUser,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalUser / limit)
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
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