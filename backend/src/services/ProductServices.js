const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, discount, selled, discounts, origin } = newProduct
        try {
            // SỬA: Kiểm tra product trùng
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR', // SỬA: 'OK' -> 'ERR'
                    message: 'The name of product is already'
                })
                return; // THÊM: return để dừng function
            }
            if (origin && !['domestic', 'international'].includes(origin)) {
                resolve({
                    status: 'ERR',
                    message: 'origin must be "domestic" or "international"'
                })
                return;
            }

            // SỬA: Thêm giá trị mặc định cho các trường optional
            const createdProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating: rating || 0,
                description: description || '',
                discount: discount || 0,
                discounts: discounts || [],
                selled: selled || 0,
                origin: origin || 'domestic'
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
    return new Promise(async (resolve, reject) => {
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

const updateFlashSaleProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date();
            const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

            console.log('🔄 Checking for slow-selling products...');

            // 1. TÌM SẢN PHẨM BÁN Ế (trong nước)
            // Điều kiện: tồn kho > 100, bán < 100, tạo trong 30 ngày, là hàng trong nước
            const slowProducts = await Product.find({
                countInStock: { $gt: 100 },
                selled: { $lt: 100 },
                createdAt: { $gte: thirtyDaysAgo },
                origin: 'domestic'  // CHỈ LẤY HÀNG TRONG NƯỚC
            });

            console.log(`📦 Found ${slowProducts.length} slow-selling products`);

            // 2. CẬP NHẬT FLASH SALE CHO TỪNG SẢN PHẨM
            for (const product of slowProducts) {
                let baseDiscount = 0;

                // Lấy discount gốc
                if (typeof product.discount === 'number') {
                    baseDiscount = product.discount;
                } else if (product.discount?.percent) {
                    baseDiscount = product.discount.percent;
                }

                // Flash Sale discount = gấp đôi (tối thiểu 5%, tối đa 90%)
                const flashDiscount = Math.min(Math.max(baseDiscount * 2, 5), 90);

                // Thời gian kết thúc: 24h từ bây giờ
                const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

                await Product.updateOne(
                    { _id: product._id },
                    {
                        $set: {
                            isFlashSale: true,
                            flashSaleDiscount: flashDiscount,
                            flashSaleEndTime: endTime
                        }
                    }
                );

                console.log(`✅ ${product.name}: ${baseDiscount}% → ${flashDiscount}% (Flash Sale)`);
            }

            // 3. RESET CÁC SẢN PHẨM FLASH SALE ĐÃ HẾT HẠN
            const resetResult = await Product.updateMany(
                {
                    isFlashSale: true,
                    flashSaleEndTime: { $lt: now }
                },
                {
                    $set: {
                        isFlashSale: false,
                        flashSaleDiscount: 0,
                        flashSaleEndTime: null
                    }
                }
            );

            console.log(`🔄 Reset ${resetResult.modifiedCount} expired Flash Sale products`);

            resolve({
                status: 'OK',
                message: 'Flash Sale updated successfully',
                newFlashSale: slowProducts.length,
                resetCount: resetResult.modifiedCount
            });
        } catch (e) {
            console.error('❌ Error updating Flash Sale:', e);
            reject(e);
        }
    });
};

const getFlashSaleProducts = (limit = 20) => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date();

            const products = await Product.find({
                isFlashSale: true,
                flashSaleEndTime: { $gt: now },
                origin: 'domestic'  // CHỈ HÀNG TRONG NƯỚC
            })
                .limit(limit)
                .sort({ flashSaleDiscount: -1, selled: 1 }); // Discount cao nhất, bán ít nhất

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: products,
                total: products.length,
                flashSaleEndTime: products[0]?.flashSaleEndTime || null
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getInternationalProducts = (limit = 20) => {
    return new Promise(async (resolve, reject) => {
        try {
            // CHỈ LẤY HÀNG NƯỚC NGOÀI có rating tốt và bán chạy
            const products = await Product.find({
                origin: 'international',  // CHỈ HÀNG NƯỚC NGOÀI
                rating: { $gte: 4 },
                selled: { $gte: 50 }  // Giảm threshold để dễ test
            })
                .limit(limit)
                .sort({ rating: -1, selled: -1 }); // Rating cao nhất, bán chạy nhất

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: products,
                total: products.length
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.estimatedDocumentCount()

            // Xử lý filter
            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({
                    [label]: { '$regex': filter[1] }
                })
                return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }

            // Xử lý sort
            let sortOptions = { createdAt: -1 }; // Mặc định sort theo mới nhất

            if (sort) {
                if (Array.isArray(sort)) {
                    const validFields = ['name', 'image', 'price', 'rating', 'type', 'countInStock', 'createdAt', 'selled', 'origin'];
                    const validDirections = ['asc', 'desc', '1', '-1'];

                    if (sort.length === 2) {
                        const [first, second] = sort;
                        const firstIsField = validFields.includes(first);
                        const firstIsDirection = validDirections.includes(first.toString().toLowerCase());
                        const secondIsField = validFields.includes(second);
                        const secondIsDirection = validDirections.includes(second.toString().toLowerCase());

                        let field, direction;
                        if (firstIsField && secondIsDirection) {
                            field = first;
                            direction = second;
                        } else if (firstIsDirection && secondIsField) {
                            field = second;
                            direction = first;
                        } else {
                            throw new Error(`Không thể xác định field và direction`);
                        }
                        const sortValue = ['asc', '1'].includes(direction.toString().toLowerCase()) ? 1 : -1;
                        sortOptions = { [field]: sortValue };
                    }
                } else if (typeof sort === 'string') {
                    const sortParts = sort.includes(':') ? sort.split(':') : sort.split(' ');
                    if (sortParts.length === 2) {
                        const [field, direction] = sortParts;
                        const validFields = ['name', 'image', 'price', 'rating', 'type', 'countInStock', 'createdAt', 'selled', 'origin'];
                        const validDirections = ['asc', 'desc', '1', '-1'];
                        if (validFields.includes(field) && validDirections.includes(direction.toLowerCase())) {
                            const sortValue = ['asc', '1'].includes(direction.toLowerCase()) ? 1 : -1;
                            sortOptions = { [field]: sortValue };
                        }
                    } else if (['asc', 'desc'].includes(sort.toLowerCase())) {
                        sortOptions = { name: sort.toLowerCase() === 'asc' ? 1 : -1 };
                    }
                }
            }

            // Query products
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
    getAllProduct,
    updateFlashSaleProducts,
    getFlashSaleProducts,
    getInternationalProducts
}