import { axiosJWT } from "./UserServices";

const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

// Admin Account Management
export const createAdminAccount = async (data, access_token) => {
    try {
        const res = await axiosJWT.post(
            buildUrl('admin/create'),
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('createAdminAccount error:', error);
        throw error;
    }
};

export const getAllAdminAccounts = async (access_token) => {
    try {
        const res = await axiosJWT.get(
            buildUrl('admin/get-all'),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('getAllAdminAccounts error:', error);
        throw error;
    }
};

export const getAdminById = async (id, access_token) => {
    try {
        const res = await axiosJWT.get(
            buildUrl(`admin/get-details/${id}`),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('getAdminById error:', error);
        throw error;
    }
};

export const updateAdminAccount = async (id, data, access_token) => {
    try {
        const res = await axiosJWT.put(
            buildUrl(`admin/update/${id}`),
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('updateAdminAccount error:', error);
        throw error;
    }
};

export const deleteAdminAccount = async (id, access_token) => {
    try {
        const res = await axiosJWT.delete(
            buildUrl(`admin/delete/${id}`),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('deleteAdminAccount error:', error);
        throw error;
    }
};

export const changeAdminPassword = async (id, data, access_token) => {
    try {
        const res = await axiosJWT.put(
            buildUrl(`admin/change-password/${id}`),
            data,
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('changeAdminPassword error:', error);
        throw error;
    }
};

// Role Management
export const getAllRoleTemplates = async (access_token) => {
    try {
        const res = await axiosJWT.get(
            buildUrl('admin/roles/templates'),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('getAllRoleTemplates error:', error);
        throw error;
    }
};

export const getPermissionsByRole = async (roleKey, access_token) => {
    try {
        const res = await axiosJWT.get(
            buildUrl(`admin/roles/permissions/${roleKey}`),
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('getPermissionsByRole error:', error);
        throw error;
    }
};

export const updateUserPermissions = async (userId, permissions, access_token) => {
    try {
        const res = await axiosJWT.put(
            buildUrl(`admin/roles/update-permissions/${userId}`),
            { permissions },
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('updateUserPermissions error:', error);
        throw error;
    }
};