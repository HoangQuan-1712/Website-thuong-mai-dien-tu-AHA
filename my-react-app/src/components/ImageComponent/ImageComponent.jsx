import React, { useState, forwardRef } from 'react';

const ImageComponent = forwardRef(function ImageComponent(
    {
        src,
        alt,
        href,
        target,
        rel,
        aspectRatio = '1 / 1',
        fit = 'contain',
        width = '100%',
        height = '100%',
        radius = 12,
        border = '1px solid var(--alias-outline-overlay, rgba(0, 0, 0, 0.05))',
        background = 'var(--alias-theme, #fff)',
        loading = 'lazy',
        decoding = 'async',
        fallbackSrc,
        className,
        containerStyle,
        imgStyle,
        onClick,
        ...rest
    },
    ref
) {
    const [err, setErr] = useState(false);
    const imgSrc = err && fallbackSrc ? fallbackSrc : src;
    const Comp = href ? 'a' : 'div';
    const computedRel = href && target === '_blank' ? (rel || 'noopener noreferrer') : rel;

    return (
        <Comp
            ref={ref}
            href={href}
            target={target}
            rel={computedRel}
            onClick={onClick}
            className={className}
            style={{
                borderRadius: radius,
                border,
                background,
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                boxSizing: 'content-box',
                color: 'rgb(11, 116, 229)',
                textDecoration: 'none',
                ...containerStyle,
            }}
            {...rest}
        >
            <img
                src={imgSrc}
                alt={alt}
                loading={loading}
                decoding={decoding}
                onError={() => setErr(true)}
                style={{
                    width,
                    height,
                    opacity: 1,
                    aspectRatio,
                    borderStyle: 'none',
                    boxSizing: 'border-box',
                    maxWidth: '100%',
                    display: 'block',
                    objectFit: fit,
                    ...imgStyle,
                }}
            />
        </Comp>
    );
});

export default ImageComponent;
