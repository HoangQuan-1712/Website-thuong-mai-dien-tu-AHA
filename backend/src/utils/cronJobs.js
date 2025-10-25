// cronJobs.js - Tạo file mới trong thư mục root hoặc /utils
const cron = require('node-cron');
const ProductServices = require('../services/ProductServices');

// ============================================
// CRON JOB: CẬP NHẬT FLASH SALE MỖI NGÀY
// ============================================

// Chạy lúc 00:00 mỗi ngày
const flashSaleCronJob = cron.schedule('0 0 * * *', async () => {
    console.log('⏰ [CRON] Running daily Flash Sale update at:', new Date().toLocaleString('vi-VN'));

    try {
        const result = await ProductServices.updateFlashSaleProducts();
        console.log('✅ [CRON] Flash Sale updated:', result);
    } catch (error) {
        console.error('❌ [CRON] Flash Sale update failed:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});

// ============================================
// CRON JOB: KIỂM TRA VÀ RESET FLASH SALE HẾT HẠN (Chạy mỗi giờ)
// ============================================

const checkExpiredFlashSale = cron.schedule('0 * * * *', async () => {
    console.log('⏰ [CRON] Checking expired Flash Sale at:', new Date().toLocaleString('vi-VN'));

    try {
        const Product = require('../models/ProductModel');
        const now = new Date();

        const result = await Product.updateMany(
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

        if (result.modifiedCount > 0) {
            console.log(`🔄 [CRON] Reset ${result.modifiedCount} expired Flash Sale products`);
        }
    } catch (error) {
        console.error('❌ [CRON] Check expired Flash Sale failed:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});

// ============================================
// START CRON JOBS
// ============================================

const startCronJobs = () => {
    console.log('🚀 Starting cron jobs...');

    flashSaleCronJob.start();
    console.log('✅ Flash Sale daily update cron job started (runs at 00:00)');

    checkExpiredFlashSale.start();
    console.log('✅ Flash Sale expiry check cron job started (runs hourly)');

    // Chạy update Flash Sale ngay lần đầu khi start server
    console.log('🔄 Running initial Flash Sale update...');
    ProductServices.updateFlashSaleProducts()
        .then(result => console.log('✅ Initial Flash Sale update completed:', result))
        .catch(error => console.error('❌ Initial Flash Sale update failed:', error));
};

module.exports = { startCronJobs };