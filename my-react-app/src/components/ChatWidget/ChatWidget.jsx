import React, { useState } from 'react';
import ChatPopup from './ChatPopup';

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
    minWidth: 52,
    boxSizing: 'content-box',
    visibility: 'visible',
};

const imgStyle = {
    width: 32,
    height: 32,
    objectFit: 'cover',
    flexShrink: 0,
    visibility: 'visible',
};

const labelStyle = {
    color: 'rgb(255, 255, 255)',
    fontSize: 11,
    lineHeight: '16px',
    fontWeight: 400,
    textAlign: 'center',
    marginTop: 4,
    visibility: 'visible',
};

export default function ChatWidget() {
    const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

    const toggleLiveChat = () => {
        setIsLiveChatOpen(!isLiveChatOpen);
    };

    return (
        <>
            {/* Cửa sổ Live Chat - hiện khi bấm "Tin mới" */}
            {isLiveChatOpen && <ChatPopup onClose={toggleLiveChat} />}

            {/* Nút widget - CHỈ HIỆN khi popup đóng */}
            {!isLiveChatOpen && (
                <div style={containerStyle}>
                    {/* Mục 1: Chatbot (Trợ lý) */}
                    <div
                        id="chatbot"
                        style={itemStyle}
                        role="button"
                    >
                        <img
                            style={imgStyle}
                            alt="chatbot"
                            src="https://salt.tikicdn.com/ts/ta/f8/a1/bf/95b4110dc1fba3d9b48dfc6c60be4a90.png"
                            width={32}
                            height={32}
                        />
                        <div style={labelStyle}>
                            Trợ lý
                        </div>
                    </div>

                    {/* Mục 2: Live Chat (Tin mới) */}
                    <div
                        id="chat-platform"
                        style={itemStyle}
                        role="button"
                        tabIndex={0}
                        aria-label="Tin mới"
                        onClick={toggleLiveChat}
                    >
                        <img
                            style={imgStyle}
                            src="https://salt.tikicdn.com/ts/ta/e1/5e/b4/2e33d86e11e2841a6a571de6084ff365.png"
                            alt="chat-consumer"
                            width={32}
                            height={32}
                        />
                        <div style={labelStyle}>
                            Tin mới
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}