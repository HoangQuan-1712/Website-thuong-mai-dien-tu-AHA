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

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(
        buildUrl(`user/get-details/${id}`), {
        headers: {
            token: `Bearer ${access_token}`,
            Authorization: `Bearer ${access_token}`
        },
        withCredentials: true

    }
    )
    return res.data
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