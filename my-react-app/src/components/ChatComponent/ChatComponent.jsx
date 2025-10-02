import React from 'react';

export default function ChatComponent() {
    const containerStyle = {
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.2)',
        zIndex: 999,
        borderRadius: 12,
        background:
            'linear-gradient(0deg, rgb(10, 104, 255), rgb(10, 104, 255)), linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))',
        bottom: 24,
        right: 40,
        opacity: 1,
        visibility: 'visible',
        unicodeBidi: 'isolate',
    };

    const itemStyle = {
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 6px',
        minWidth: 52,              // = 52px
        boxSizing: 'content-box',
        visibility: 'visible',
    };

    const imgStyle = {
        maxWidth: '100%',
        borderStyle: 'none',
        width: 32,
        height: 32,
        display: 'block',
    };

    const labelStyle = {
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '18px',
        textAlign: 'center',
        color: 'rgb(255, 255, 255)',
        marginTop: 4,
        display: 'block',
        unicodeBidi: 'isolate',
        cursor: 'pointer',
        visibility: 'visible',
    };

    return (
        <div style={containerStyle}>
            {/* Mục 1: Trợ lý */}
            <div
                style={itemStyle}
                role="button"
                tabIndex={0}
                aria-label="Trợ lý"
            >
                <img
                    style={imgStyle}
                    className="chat-gpt-icon"
                    alt="chat-gpt-icon"
                    src="https://salt.tikicdn.com/ts/ta/f8/a1/bf/95b4110dc1fba3d9b48dfc6c60be4a90.png"
                    width={32}
                    height={32}
                />
                <div
                    style={labelStyle}
                    className="sc-dcf63fc3-1 jdXJsQ"
                >
                    Trợ lý
                </div>
            </div>

            {/* Mục 2: Tin mới */}
            <div
                style={{
                    display: 'block',
                    unicodeBidi: 'isolate',
                    visibility: 'visible',
                }}
            >
                <div
                    id="chat-platform"
                    className="sc-55e8fd1b-0 gfmKtz"
                    style={itemStyle}
                    role="button"
                    tabIndex={0}
                    aria-label="Tin mới"
                >
                    <img
                        style={imgStyle}
                        src="https://salt.tikicdn.com/ts/ta/e1/5e/b4/2e33d86e11e2841a6a571de6084ff365.png"
                        alt="chat-consumer"
                        width={32}
                        height={32}
                    />
                    <div
                        style={labelStyle}
                        className="sc-55e8fd1b-1 ixaWNq"
                    >
                        Tin mới
                    </div>
                </div>
            </div>
        </div>
    );
}
