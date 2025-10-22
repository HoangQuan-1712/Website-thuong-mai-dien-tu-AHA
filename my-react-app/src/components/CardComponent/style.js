import styled from 'styled-components'
import { Card } from 'antd';

export const WrapperCardStyle = styled(Card)
    `
    width: 240px;
    &  img {
        width: 151px;
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
    --tw-space-x-reverse: 0;
    margin-left: calc(.25rem * (1 - var(--tw-space-x-reverse)));
    margin-right: calc(.25rem * var(--tw-space-x-reverse));
    color: rgba(0, 0, 0, .87);
    font-size: 1.0rem;
    line-height: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

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