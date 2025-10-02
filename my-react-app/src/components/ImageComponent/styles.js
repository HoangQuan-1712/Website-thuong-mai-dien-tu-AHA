import styled from 'styled-components';

export const Frame = styled.div`
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  box-sizing: content-box;
  text-decoration: none;        /* khi as="a" thì vẫn không gạch chân */
  color: rgb(11, 116, 229);     /* match màu link bạn đang dùng */
`;

export const Img = styled.img`
  display: block;
  max-width: 100%;
  border-style: none;
  box-sizing: border-box;
  opacity: 1;
`;
