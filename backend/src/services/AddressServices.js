const Address = require("../models/AddressModel");


const createAddress = (userId, addressData) => {
    return new Promise(async(resolve, reject) => {
        try {
            const { fullName, phone, addressLine1, addressLine2, ward, district, province, label, isDefault } = addressData;


            if (isDefault) {

                await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
            }

            const newAddress = await Address.create({
                user: userId,
                fullName,
                phone,
                addressLine1,
                addressLine2: addressLine2 || '',
                ward: ward || '',
                district: district || '',
                province: province || '',
                label: label || 'home',
                isDefault: isDefault || false
            });


            const addressCount = await Address.countDocuments({ user: userId, isDeleted: false });
            if (addressCount === 1) {
                newAddress.isDefault = true;
                await newAddress.save();
            }

            resolve({
                status: 'OK',
                message: 'Thêm địa chỉ thành công',
                data: newAddress
            });
        } catch (e) {
            reject(e);
        }
    });
};


const getAllAddresses = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const addresses = await Address.find({
                user: userId,
                isDeleted: false
            }).sort({ isDefault: -1, createdAt: -1 });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: addresses
            });
        } catch (e) {
            reject(e);
        }
    });
};


const getAddressById = (addressId, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const address = await Address.findOne({
                _id: addressId,
                user: userId,
                isDeleted: false
            });

            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: address
            });
        } catch (e) {
            reject(e);
        }
    });
};


const updateAddress = (addressId, userId, updateData) => {
    return new Promise(async(resolve, reject) => {
        try {
            const address = await Address.findOne({
                _id: addressId,
                user: userId,
                isDeleted: false
            });

            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại'
                });
                return;
            }


            if (updateData.isDefault) {
                await Address.updateMany({ user: userId, _id: { $ne: addressId } }, { $set: { isDefault: false } });
            }

            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                updateData, { new: true }
            );

            resolve({
                status: 'OK',
                message: 'Cập nhật địa chỉ thành công',
                data: updatedAddress
            });
        } catch (e) {
            reject(e);
        }
    });
};


const setDefaultAddress = (addressId, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const address = await Address.findOne({
                _id: addressId,
                user: userId,
                isDeleted: false
            });

            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại'
                });
                return;
            }


            await Address.updateMany({ user: userId }, { $set: { isDefault: false } });


            address.isDefault = true;
            await address.save();

            resolve({
                status: 'OK',
                message: 'Đã đặt làm địa chỉ mặc định',
                data: address
            });
        } catch (e) {
            reject(e);
        }
    });
};


const deleteAddress = (addressId, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const address = await Address.findOne({
                _id: addressId,
                user: userId,
                isDeleted: false
            });

            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại'
                });
                return;
            }


            address.isDeleted = true;
            await address.save();


            if (address.isDefault) {
                const nextAddress = await Address.findOne({
                    user: userId,
                    isDeleted: false
                }).sort({ createdAt: -1 });

                if (nextAddress) {
                    nextAddress.isDefault = true;
                    await nextAddress.save();
                }
            }

            resolve({
                status: 'OK',
                message: 'Xóa địa chỉ thành công'
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createAddress,
    getAllAddresses,
    getAddressById,
    updateAddress,
    setDefaultAddress,
    deleteAddress
};