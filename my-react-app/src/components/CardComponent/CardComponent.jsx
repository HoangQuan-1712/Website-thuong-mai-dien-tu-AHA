import React from "react"
import { StyleNameProduct, WapperPriceDiscount, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style"
import { StarFilled } from '@ant-design/icons';



const CardComponent = () => {
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '100%', height: '290px' }}
            style={{ width: '185px', height: '290px' }}
            bodyStyle={{ padding: 10 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <StyleNameProduct>Áo thun nam</StyleNameProduct>
            <WrapperReportText>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>4.5</span>
                    <StarFilled style={{ color: '#fadb14', fontSize: '10px' }} />
                    <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
                </div>
                <div>

                </div>
            </WrapperReportText>
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
                <WrapperPriceText cursorshover="true">
                    Giá: 200.000
                    <sup cursorshover="true" style={{ top: '-0.5em' }}>₫</sup>
                </WrapperPriceText>

            </div>
            <div style={{
                display: 'flex',
                gap: '4px',
                height: '18px'
            }}>
                <WrapperDiscountText>
                    -5%
                </WrapperDiscountText>
                <WapperPriceDiscount>180.000₫</WapperPriceDiscount>
            </div>

        </WrapperCardStyle >
    );
}

export default CardComponent;