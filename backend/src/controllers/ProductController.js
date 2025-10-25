const ProductServices = require('../services/ProductServices')


const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, selled, discount, origin } = req.body
        console.log('req.body', req.body);

        if (!name || !image || !type || !price || !countInStock) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if (origin && !['domestic', 'international'].includes(origin)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'origin must be "domestic" or "international"'
            })
        }
        const response = await ProductServices.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body

        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductServices.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        //const token = req.headers

        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ProductId is required'
            })
        }
        const response = await ProductServices.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        //const token = req.headers

        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductServices.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        let sortParam = null

        // Xử lý sort parameter
        if (sort) {
            if (Array.isArray(sort)) {
                // Nếu sort là mảng từ query string (?sort=name&sort=asc)
                sortParam = sort
            } else if (typeof sort === 'string') {
                // Xử lý các định dạng khác nhau
                if (sort.startsWith('[') && sort.endsWith(']')) {
                    // JSON array format: "[field,direction]"
                    try {
                        sortParam = JSON.parse(sort)
                    } catch (e) {
                        return res.status(400).json({
                            message: 'Định dạng JSON sort không hợp lệ. Ví dụ: ["name","asc"]'
                        })
                    }
                } else if (sort.includes(',')) {
                    // Comma separated: "name,asc"
                    sortParam = sort.split(',').map((s) => s.trim())
                } else if (sort.includes(':') || sort.includes(' ')) {
                    // Colon or space separated: "name:asc" hoặc "name asc"
                    sortParam = sort
                } else if (['asc', 'desc'].includes(sort.toLowerCase())) {
                    // Chỉ có direction, mặc định sort theo name
                    sortParam = sort
                } else {
                    return res.status(400).json({
                        message: 'Định dạng sort không hợp lệ. Sử dụng: "field:direction", "field,direction", hoặc ["field","direction"]'
                    })
                }
            }
        }

        const response = await ProductServices.getAllProduct(
            Number(limit) || 8,
            Number(page) || 0,
            sortParam,
            filter
        );
        return res.status(200).json(response);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const getFlashSale = async (req, res) => {
    try {
        const { limit } = req.query;
        const response = await ProductServices.getFlashSaleProducts(Number(limit) || 20);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const getInternational = async (req, res) => {
    try {
        const { limit } = req.query;
        const response = await ProductServices.getInternationalProducts(Number(limit) || 20);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const forceUpdateFlashSale = async (req, res) => {
    try {
        const result = await ProductServices.updateFlashSaleProducts();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getFlashSale,
    getInternational,
    forceUpdateFlashSale
}