const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async(resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct
        try {

            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }

            const createdProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description
            })

            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct

                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            })

        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'delete product success'
            })

        } catch (e) {
            reject(e)
        }
    })
}


const getAllProduct = (limit, page, sort = null, filter) => {
    return new Promise(async(resolve, reject) => {
        try {
            const totalProduct = await Product.estimatedDocumentCount()

            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({
                    [label]: { '$regex': filter[1] } })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }

            let sortOptions = {};

            // Xử lý sort parameters
            if (sort) {
                if (Array.isArray(sort)) {
                    // Xử lý mảng sort: ['field', 'direction'] hoặc ['direction', 'field']
                    const validFields = ['name', 'image', 'price', 'rating', 'type', 'countInStock', 'createdAt'];
                    const validDirections = ['asc', 'desc', '1', '-1'];

                    if (sort.length === 2) {
                        const [first, second] = sort;

                        // Kiểm tra xem phần tử nào là field và phần tử nào là direction
                        const firstIsField = validFields.includes(first);
                        const firstIsDirection = validDirections.includes(first.toString().toLowerCase());
                        const secondIsField = validFields.includes(second);
                        const secondIsDirection = validDirections.includes(second.toString().toLowerCase());

                        let field, direction;

                        if (firstIsField && secondIsDirection) {
                            // Trường hợp: ['field', 'direction']
                            field = first;
                            direction = second;
                        } else if (firstIsDirection && secondIsField) {
                            // Trường hợp: ['direction', 'field'] 
                            field = second;
                            direction = first;
                        } else {
                            throw new Error(`Không thể xác định field và direction từ: [${sort.join(', ')}]. Các field hợp lệ: ${validFields.join(', ')}. Các direction hợp lệ: ${validDirections.join(', ')}`);
                        }

                        const sortValue = ['asc', '1'].includes(direction.toString().toLowerCase()) ? 1 : -1;
                        sortOptions[field] = sortValue;
                    } else {
                        throw new Error(`Mảng sort phải có đúng 2 phần tử: [field, direction] hoặc [direction, field]`);
                    }
                } else if (typeof sort === 'string') {
                    // Xử lý chuỗi sort: "field:direction" hoặc "field direction"
                    const sortParts = sort.includes(':') ? sort.split(':') : sort.split(' ');
                    if (sortParts.length === 2) {
                        const [field, direction] = sortParts;
                        const validFields = ['name', 'image', 'price', 'rating', 'type', 'countInStock', 'createdAt'];
                        const validDirections = ['asc', 'desc', '1', '-1'];

                        if (validFields.includes(field) && validDirections.includes(direction.toLowerCase())) {
                            const sortValue = ['asc', '1'].includes(direction.toLowerCase()) ? 1 : -1;
                            sortOptions[field] = sortValue;
                        } else {
                            throw new Error(`Trường sort không hợp lệ: ${field} hoặc hướng sort: ${direction}. Các field hợp lệ: ${validFields.join(', ')}. Các direction hợp lệ: ${validDirections.join(', ')}`);
                        }
                    } else if (['asc', 'desc'].includes(sort.toLowerCase())) {
                        // Mặc định sort theo name nếu chỉ có direction
                        sortOptions.name = sort.toLowerCase() === 'asc' ? 1 : -1;
                    } else {
                        throw new Error('Định dạng sort không hợp lệ. Sử dụng: "field:direction" hoặc ["field", "direction"]');
                    }
                } else {
                    throw new Error('Tham số sort phải là chuỗi hoặc mảng');
                }
            }

            const allProduct = await Product.find()
                .limit(limit)
                .skip(page * limit)
                .sort(sortOptions);

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}