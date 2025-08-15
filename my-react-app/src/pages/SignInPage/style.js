import styled from "styled-components"

export const WrapperContainerLeft = styled.div `
    flex: 1;
    padding: 40px 45px 24px;
    display: flex;
    flex-direction: column;
`;


export const WrapperContainerRight = styled.div `
    width: 300px;
    background: linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%); 
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`;

export const WrapperTextAHA = styled.h4 `
    margin: 0px 0px 5px;
    color: rgb(10, 104, 255);
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
`;