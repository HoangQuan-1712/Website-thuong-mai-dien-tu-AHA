import React from 'react'
import HeaderComponent from '../HeaderComponents/HeaderComponents';

const DefaultComponents = ({ children }) => {
    return (
        <div>
            <HeaderComponent />
            {children}
        </div>
    );
};

export default DefaultComponents;

