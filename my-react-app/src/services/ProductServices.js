import axios from "axios";
const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

export const getAllProduct = async () => {
    try {
        const res = await axios.get(
            buildUrl('product/getAll')
        );
        console.log('API getAllProduct response:', res);
        // Đảm bảo trả về toàn bộ response object
        return res.data;
    } catch (error) {
        console.error('Error in getAllProduct:', error);
        throw error;
    }
}