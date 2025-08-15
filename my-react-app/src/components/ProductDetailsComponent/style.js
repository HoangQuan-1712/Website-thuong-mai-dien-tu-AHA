import styled from 'styled-components';
import { Col, Image, InputNumber } from 'antd';

export const WrapperStyleImageSmall = styled(Image)
`
    height: 42px;
    width: 42px;
`;

export const WrapperStyleColImage = styled(Col)
`
    flex-basis: unset;
    display: flex;
    padding: 4px;
    overflow: hidden;
    
    
`;

export const WrapperStyleImage = styled(Image)
`
    border-radius: 8px;
    overflow: hidden;
    

    .ant-image-img {
        border-radius: 8px;
        object-fit: cover;
        
    }
`


export const WrapperStyleNameProduct = styled.h1 `
    color: rgb(39, 39, 42);
    font-size: 20px;
    font-weight: 500;
    line-height: 150%;
    word-break: break-word;
    white-space: break-spaces;
`;

export const WrapperStyleNameBrand = styled.h6 `
    color: rgb(36, 36, 36);
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
`;

export const WrapperStyleTextSell = styled.span `
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120);
`;

export const WrapperPriceProduct = styled.div `
    background: rgb(250, 250, 250);
    border-radius: 4px;
`;

export const WrapperPriceTextProduct = styled.h1 `
   font-size: 32px;
   line-height: 40px;
   margin-right: 8px;
   font-weight: 500;
   padding: 10px
`;

export const WrapperAddressProduct = styled.div `
    span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsisl;
    },
    span.chage-address {
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    }
`;

export const WrapperQualityProduct = styled.div `
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 120px;
    display: flex;
    align-items: center;
    gap: 4px
     
`;

export const WrapperBtnQualityProduct = styled.div `
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
`;

export const WrapperInputNumber = styled(InputNumber)
`
    &.ant-input-number.ant-input-number-sm {
        width: 60px;
        border-top: none;
        border-bottom: none; 
    }
    
    .ant-input-number-handler-wrap {
        display: none !important;
    }
    
    .ant-input-number-input {
        text-align: center;
    }
`;