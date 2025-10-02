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

export const StyleNameProduct = styled.div`
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
        overflow: hidden;
        color: var(--Alias-Primary---On-Theme, #27272a);
        text-overflow: ellipsis;
        font-size: 13.5px;
        font-weight: 400;
        line-height: 150%;
        margin: 0px;
        word-break: break-word;
`;

export const WrapperReportText = styled.div`
    font - size: 11px;
    color: rgb(128, 128, 137);
    dísplay: flex;
    align - items: center;
`;

export const WrapperPriceText = styled.div`
    font - size: 16px;
    font - weight: 600px;
    color: rgb(255, 66, 78);
    line-height: 150%;
    margin - top: 10px;
`;
export const WrapperDiscountText = styled.span`
    display: flex;
    padding: 0px 4px;
    align-items: flex-start;
    border-radius: 8px;
    background: var(--Alias-Theme-Variant, #f5f5fa);
    color: var(--Alias-Primary---On-Theme, #27272a);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120);
`;

export const WapperPriceDiscount = styled.div`
    color: var(--Alias-Secondary---On-Theme, #808089);
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    text-decoration-line: line-through;
    margin-left: 4px;

`;