// src/components/ArrowButton/ArrowButton.jsx
import React from 'react';
import { ButtonWrapper } from './styles';

const LeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 18 18" fill="none">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M12.089 3.411a1 1 0 0 0-1.414 0L5.675 8.41a1 1 0 0 0 0 1.179l5 5a1 1 0 1 0 1.414-1.413L8.679 9l3.41-3.411a1 1 0 0 0 0-1.178Z"
            fill="#0A68FF" />
    </svg>
);

const RightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 18 18" fill="none">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
            fill="#0A68FF" />
    </svg>
);

export default function ArrowButton({
    direction = 'right',           // 'left' | 'right'
    onClick,
    ariaLabel,
    style,
    className,
    disabled = false,
    children,                      // nếu muốn truyền icon tuỳ biến
}) {
    const isLeft = direction === 'left';
    return (
        <ButtonWrapper
            type="button"
            data-direction={direction}
            aria-label={ariaLabel || (isLeft ? 'Xem trước' : 'Xem tiếp')}
            onClick={onClick}
            className={className}
            style={style}
            disabled={disabled}
        >
            {children ?? (isLeft ? <LeftIcon /> : <RightIcon />)}
        </ButtonWrapper>
    );
}
