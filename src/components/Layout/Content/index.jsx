import React from 'react';
import './index.css';

const MainContentBox = ({ children }) => {
    return (
        <div className="content">
            {children}
        </div>
    );
};

export default MainContentBox;
