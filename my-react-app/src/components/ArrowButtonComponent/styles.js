// src/components/ArrowButton/styles.js
import styled from 'styled-components';

export const ButtonWrapper = styled.button`
  position: absolute;
  top: 50%;
  ${(p) => (p['data-direction'] === 'left' ? 'left: 8px;' : 'right: 8px;')}
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 16px;
  border: none;
  background-color: #fff;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 2;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &:hover { transform: translateY(-50%) scale(1.05); box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
  &:active { transform: translateY(-50%) scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
