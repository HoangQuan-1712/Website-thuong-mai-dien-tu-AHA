import axios from "axios"

export const axiosJWT = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Normalize base URL to ensure exactly one trailing slash
const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

export const loginUser = async (data) => {
    const res = await axios.post(
        buildUrl("user/sign-in"),
        data,
        { withCredentials: true }
    )
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(buildUrl("user/sign-up"), data, { withCredentials: true })
    return res.data
}

export const updateUserProfile = async (id, data, access_token) => {
    // Debug log
    console.log('updateUserProfile called with:');
    console.log('- id:', id);
    console.log('- data:', data);
    console.log('- access_token:', access_token);

    if (!id) {
        throw new Error('User ID is required for update');
    }

    // SỬA: Dùng buildUrl thay vì ghép trực tiếp để tránh duplicate "/api/"
    const url = buildUrl(`user/update-user/${id}`);
    console.log('- Full URL:', url);

    try {
        const res = await axiosJWT.put(url, data, {
            headers: {
                token: `Bearer ${access_token}`,
            },
        });
        console.log('Update response:', res);
        return res;
    } catch (error) {
        console.error('Update error:', error.response || error);
        throw error;
    }
};

export const getDetailsUser = async (id, access_token) => {
    console.log('getDetailsUser called with id:', id);

    const res = await axiosJWT.get(
        buildUrl(`user/get-details/${id}`), {
        headers: {
            token: `Bearer ${access_token}`,
            Authorization: `Bearer ${access_token}`
        },
        withCredentials: true
    });

    console.log('getDetailsUser response:', res.data);
    return res.data;
}

export const refreshToken = async () => {
    const res = await axios.post(
        buildUrl('user/refresh-token'),
        {},
        { withCredentials: true }
    );
    return res.data;
}

export const logoutUser = async () => {
    const res = await axios.post(
        buildUrl('user/log-out'),
        {},
    );
    return res.data;
}