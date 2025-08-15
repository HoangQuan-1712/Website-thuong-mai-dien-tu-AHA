import React from "react"
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style"
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
            <WrapperPriceText>Giá: 200.000 đ
                <WrapperDiscountText>
                    -5%
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    );
}

export default CardComponent;