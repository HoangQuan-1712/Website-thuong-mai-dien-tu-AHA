import axios from "axios";
const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

export const getAllProduct = async (limit = 100, page = 0, sort, filter) => {
    try {
        const params = new URLSearchParams();
        params.append('limit', limit);
        params.append('page', page);
        if (sort) params.append('sort', sort);
        if (filter) params.append('filter', filter);

        const res = await axios.get(
            buildUrl(`product/getAll?${params.toString()}`)  // ✅ FIX
        );
        console.log('API getAllProduct response:', res);
        return res.data;
    } catch (error) {
        console.error('Error in getAllProduct:', error);
        throw error;
    }
}

export const getFlashSaleProducts = async (limit = 20) => {
    try {
        const res = await axios.get(
            buildUrl(`product/flash-sale?limit=${limit}`)
        );
        console.log('Flash Sale products:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching flash sale:', error);
        throw error;
    }
};

export const getInternationalProducts = async (limit = 20) => {
    try {
        const res = await axios.get(
            buildUrl(`product/international?limit=${limit}`)
        );
        console.log('International products:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching international products:', error);
        throw error;
    }
};

export const forceUpdateFlashSale = async (access_token) => {
    try {
        const res = await axios.post(
            buildUrl('product/update-flash-sale'),
            {},
            {
                headers: {
                    token: `Bearer ${access_token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Error forcing flash sale update:', error);
        throw error;
    }
};