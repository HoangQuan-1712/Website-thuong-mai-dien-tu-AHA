import axios from "axios";
import { axiosJWT } from "./UserServices";

const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

// Địa chỉ
export const createAddress = async (data, access_token) => {
    try {
        const res = await axiosJWT.post(
            buildUrl('address/create'),
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('createAddress error:', error);
        throw error;
    }
};

export const getAllAddresses = async (access_token) => {
    try {
        const res = await axiosJWT.get(
            buildUrl('address/get-all'),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('getAllAddresses error:', error);
        throw error;
    }
};

export const getAddressById = async (id, access_token) => {
    try {
        const res = await axiosJWT.get(
            buildUrl(`address/get-details/${id}`),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('getAddressById error:', error);
        throw error;
    }
};

export const updateAddress = async (id, data, access_token) => {
    try {
        const res = await axiosJWT.put(
            buildUrl(`address/update/${id}`),
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('updateAddress error:', error);
        throw error;
    }
};

export const setDefaultAddress = async (id, access_token) => {
    try {
        const res = await axiosJWT.put(
            buildUrl(`address/set-default/${id}`),
            {},
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('setDefaultAddress error:', error);
        throw error;
    }
};

export const deleteAddress = async (id, access_token) => {
    try {
        const res = await axiosJWT.delete(
            buildUrl(`address/delete/${id}`),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('deleteAddress error:', error);
        throw error;
    }
};

// Location APIs
export const getAllProvinces = async () => {
    try {
        const res = await axios.get(buildUrl('location/provinces'));
        return res.data;
    } catch (error) {
        console.error('getAllProvinces error:', error);
        throw error;
    }
};

export const getDistrictsByProvince = async (provinceCode) => {
    try {
        const res = await axios.get(buildUrl(`location/districts/${provinceCode}`));
        return res.data;
    } catch (error) {
        console.error('getDistrictsByProvince error:', error);
        throw error;
    }
};

export const getWardsByDistrict = async (districtCode) => {
    try {
        const res = await axios.get(buildUrl(`location/wards/${districtCode}`));
        return res.data;
    } catch (error) {
        console.error('getWardsByDistrict error:', error);
        throw error;
    }
};