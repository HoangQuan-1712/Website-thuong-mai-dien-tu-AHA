import styled from 'styled-components'
import { Row } from 'antd'

export const WrapperHeader = styled(Row)
`
  padding: 10px 130px;
  background-color: rgb(62, 135, 188);
  align-items: center;
  height: 70px;
  width: 100%;
  box-sizing: border-box;
`;

export const WrapperTextHeader = styled.span `
font-size: 12px;
color: #fff;
font-weight: bold;
text-align: center;
display: flex;
flex-direction: column;

`;


export const WrapperAccountHeader = styled.div `
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    white-space: nowrap;
`;


export const WrapperCartHeader = styled.div `
    display: flex;
    align-items: center;
    color: #fff;
    white-space: nowrap;
`;