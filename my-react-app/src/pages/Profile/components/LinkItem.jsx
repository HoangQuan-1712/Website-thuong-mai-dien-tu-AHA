import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
const LinkItem = ({ to, href,
    children,
    color = 'rgba(0,0,0,.87)',
    hoverColor = '#ee4d2d',
    style,
    textStyle,
    ...rest }) => {
    const [hover, setHover] = useState(false);
    const Wrapper = to ? NavLink : 'a';
    const wrapperProps = to ? { to } : { href };

    return (
        <Wrapper
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'block',
                marginBottom: '.9375rem',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                ...style,
            }}
            {...wrapperProps}
            {...rest}
        >
            <span
                style={{
                    display: 'block',
                    fontSize: '1.45rem',
                    textTransform: 'capitalize',
                    transition: 'color .1s cubic-bezier(.4,0,.2,1)',
                    color: hover ? hoverColor : color,
                    ...textStyle,
                }}
            >
                {children}
            </span>
        </Wrapper>
    );
};

export default LinkItem;
