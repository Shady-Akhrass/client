import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
    const [activeItem, setActiveItem] = useState(null);
    const location = useLocation();

    const sidebarItems = [
        { name: 'dashboard', label: 'لوحة التحكم', icon: 'https://img.icons8.com/material-outlined/24/null/dashboard--v1.png' },
        { name: 'orphans', label: 'كفالة اليتيم', icon: 'https://img.icons8.com/material-outlined/24/null/user.png' },
        { name: 'aids', label: 'المساعدات', icon: 'https://img.icons8.com/material-outlined/24/null/box.png' },
    ];

    useEffect(() => {
        const pathname = location.pathname;
        const itemName = pathname.split('/')[1];
        setActiveItem(itemName);
        localStorage.setItem('activeItem', itemName);
        const currentItem = sidebarItems.find(item => item.name === itemName);
        if (currentItem) {
            document.title = currentItem.label;
        }
    }, [location]);

    const handleClick = (itemName) => {
        setActiveItem(itemName);
        localStorage.setItem('activeItem', itemName);
    };

    return (
        <aside className={`fixed top-0 right-0 z-40 h-screen w-64 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
            <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
                <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <div className="px-2 py-2 flex items-center justify-center mb-6">
                    </div>
                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item) => (
                            <li key={item.name} className="mx-1 ">
                                <Link
                                    to={`/${item.name}`}
                                    className={`flex items-center p-2 rounded-lg transition-colors ${activeItem === item.name ? 'bg-purple-900 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                                    onClick={() => handleClick(item.name)}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        className={`w-6 h-6 transition-colors ${activeItem === item.name ? 'filter invert brightness-0' : ''}`}
                                    />
                                    <span className="mr-3">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
