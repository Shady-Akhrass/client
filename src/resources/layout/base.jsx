import React, { useState } from 'react';
import Sidebar from './sidebar';
import Nav from './nav';

const Base = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ direction: 'rtl', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            <Sidebar isOpen={isSidebarOpen} />
            <Nav toggleSidebar={toggleSidebar} />
            <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'sm:mr-64' : 'sm:mr-0'} rounded-tl-3xl`}>
                <div className=" rounded-tl-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Base;
