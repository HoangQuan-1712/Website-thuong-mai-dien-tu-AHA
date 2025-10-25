import React from "react"
import { StyleNameProduct, WapperPriceDiscount, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style"
import { StarFilled } from '@ant-design/icons';

// Format số thành VND
const formatVND = (value) => {
    if (typeof value !== "number") return value;
    return value.toLocaleString("vi-VN");
};

// Format số lượng đã bán
const formatSelled = (selled) => {
    const num = Number(selled) || 0;
    if (num >= 2000) return "2000+";
    if (num >= 1000) return "1000+";
    return num.toString();
};

// Tính discount hiện tại dựa trên thời gian
const getActiveDiscount = (discountData) => {
    // Fix: Kiểm tra undefined/null trước
    if (discountData === undefined || discountData === null) {
        return 0;
    }

    // Nếu là số thì trả về luôn (discount cố định)
    if (typeof discountData === "number") {
        return discountData;
    }

    // Nếu là object có startDate, endDate, percent
    if (discountData && discountData.startDate && discountData.endDate && discountData.percent !== undefined) {
        const now = new Date();
        const start = new Date(discountData.startDate);
        const end = new Date(discountData.endDate);

        if (now >= start && now <= end) {
            return Number(discountData.percent) || 0;
        }
        return 0;
    }
    if (Array.isArray(discountData)) {
        const now = new Date();
        const activeDiscount = discountData.find((d) => {
            const start = new Date(d.startDate);
            const end = new Date(d.endDate);
            return now >= start && now <= end;
        });
        return activeDiscount?.percent ? Number(activeDiscount.percent) : 0;
    }

    return 0;
};

// Render số sao dựa trên rating
const renderStars = (rating) => {
    const ratingNum = Number(rating) || 0;
    const fullStars = Math.floor(ratingNum);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <StarFilled
                key={i}
                style={{ color: '#fadb14', fontSize: '10px', marginRight: '2px' }}
            />
        );
    }

    return stars;
};

const CardComponent = (props) => {
    const {
        //countInStock,
        //description,
        image,
        name,
        price,
        rating,
        //type,
        discount,
        selled
    } = props;

    console.log('Discount data:', discount);
    console.log('=== CARD PROPS ===', { name, price, rating, discount, selled });

    const productRating = Number(rating) || 0;
    const productSelled = selled !== undefined ? Number(selled) : 0; // FIX: Xử lý undefined
    const productPrice = Number(price) || 0;

    const discountData = discount !== undefined ? discount : 0;

    // Tính discount hiện tại
    const discountPercent = getActiveDiscount(discountData);
    const hasDiscount = discountPercent > 0 && productPrice > 0;

    const discountedPrice = hasDiscount
        ? Math.round(productPrice * (1 - discountPercent / 100))
        : productPrice;
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '100%', height: '290px' }}
            style={{ width: '185px', height: '315px' }}
            bodyStyle={{ padding: 10 }}
            cover={
                <img
                    alt={name}
                    src={image || "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
                />
            }
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {/* Hiển thị số rating */}
                    <span style={{ fontSize: '12px', marginRight: '2px' }}>{productRating.toFixed(1)}</span>

                    {/* Hiển thị số sao tương ứng */}
                    {renderStars(rating)}
                </div>
            </WrapperReportText>

            <WrapperReportText>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

                    {productSelled > 0 && (
                        <WrapperStyleTextSell>
                            | Đã bán {formatSelled(productSelled)}
                        </WrapperStyleTextSell>
                    )}
                </div>
            </WrapperReportText>

            {/* Giá gốc */}
            <div
                style={{
                    textAlign: 'left',
                    fontSize: 16,
                    lineHeight: 1.5,
                    fontWeight: 600,
                    color: 'rgb(39, 39, 42)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <WrapperPriceText>
                    {formatVND(discountedPrice)}
                    <sup style={{ top: '-0.5em' }}>₫</sup>
                </WrapperPriceText>
            </div>

            {/* Phần discount và giá sau discount */}
            <div style={{ display: 'flex', gap: '4px', height: '18px', alignItems: 'center' }}>
                {hasDiscount ? (
                    <>
                        <WrapperDiscountText>
                            -{discountPercent}%
                        </WrapperDiscountText>
                        <WapperPriceDiscount>
                            {formatVND(productPrice)}₫
                        </WapperPriceDiscount>
                    </>
                ) : (
                    // Không có discount thì để trống để giữ layout
                    <div style={{ height: '18px' }}></div>
                )}
            </div>
        </WrapperCardStyle>
    );
}

export default CardComponent;