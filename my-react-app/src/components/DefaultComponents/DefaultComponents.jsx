import React from 'react'
import HeaderComponent from '../HeaderComponents/HeaderComponents';
import FooterComponent from '../FooterComponent/FooterComponent';
import ChatComponent from '../ChatWidget/ChatWidget';

const DefaultComponents = ({ children }) => {
    return (
        <div>
            <HeaderComponent />
            {children}
            <ChatComponent />
            <FooterComponent />

        </div>
    );
};

export default DefaultComponents;

