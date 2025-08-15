import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

export const WrapperTypeProduct = styled.div `
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

export const WrapperMenuContainer = styled.div `
    position: relative;
    width: 100%;
`;
export const ScrollButton = styled.button `
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

export const WrapperProducts = styled.div `
display: flex;
justify-content: center;
gap: 10px;
flex-wrap: wrap;
margin-top: 10px;
align-items: center;

`;