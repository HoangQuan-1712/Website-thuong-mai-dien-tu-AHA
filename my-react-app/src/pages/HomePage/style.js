import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { Col } from 'antd';

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: flex-start;
    border-bottom: 1px solid #ccc;
    height: 40px;
    overflow-x: hidden;
    white-space: nowrap;
    position: relative;
    

    > * {
        flex: 0 0 auto;
        padding: 5px 10px;
        cursor: pointer;
    }

    /* Ẩn thanh cuộn hoàn toàn */
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`;

export const WrapperMenuContainer = styled.div`
    position: relative;
    width: 100%;
`;
export const ScrollButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
    padding: 5px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: rgba(255, 255, 255, 1);
    }

    &.left {
        left: 0;
    }

    &.right {
        right: 0;
    }
`;


export const WrapperButtonMore = styled(ButtonComponent)
    `
    &:hover {
        background: rgb(13, 92, 182);
        color: #fff;
    span {
        color: #fff;

    }
        
`;

export const WrapperProducts = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
    align-items: center;

`;

export const WrapperProductContainer = styled(Col)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: rgb(255, 255, 255);
    gap: 12px;
    border-radius: 8px;
`;

export const WrapperHeaderProductContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
    min-height: 24px;
}
`;

export const WrapperLeftHeaderProductContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    -webkit-box-align: center;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    color: rgb(39, 39, 42);
`;

export const WrapperImageContainer = styled.div`
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    border-radius: 8px;
    background: var(--Alias-Theme, #fff);
    box-sizing: border-box;
    unicode-bidi: isolate;
`;

export const WrapperChildrenImageContainer = styled.div`
    width: 100%;
    position: relative;
    box-sizing: border-box;
    display: block;
    unicode-bidi: isolate;
`;

export const WrapperContentImageContainer = styled.div`
    overflow: hidden;
    box-sizing: border-box;
    display: block;
    unicode-bidi: isolate;
`;

export const WrapperSlideImageContainer = styled.span`
    gap: 12px;
    transform: translateX(0px);
    transition: 0.5s ease-in-out;
    min-width: 100%;
    display: inline-flex;
    box-sizing: border-box;
`;

export const WrapperStyleImageContainer = styled.div`
    box-sizing: border-box;
    display: block;
    unicode-bidi: isolate;
`;