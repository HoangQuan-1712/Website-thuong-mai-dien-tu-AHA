import styled from 'styled-components'
import { Card } from 'antd';

export const WrapperCardStyle = styled(Card)
`
    width: 240px;
    &  img {
        width: 130px;
        height: 184px;
        align-item: center;
    }
        margin-bottom: 10px;
`;

export const StyleNameProduct = styled.div `
font - weight: 400;
font - size: 12px;
line - height: 16px;
color: rgb(56, 56, 61);
`;

export const WrapperReportText = styled.div `
font - size: 11px;
color: rgb(128, 128, 137);
dísplay: flex;
align - items: center;
`;

export const WrapperPriceText = styled.div `
font - size: 16px;
font - weight: 500px;
color: rgb(255, 66, 78);
margin - top: 10px;
`;
export const WrapperDiscountText = styled.span `
font - size: 12px;
font - weight: 500px;
color: rgb(255, 66, 78);
margin - top: 10px;
`;

export const WrapperStyleTextSell = styled.span `
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120);
`;