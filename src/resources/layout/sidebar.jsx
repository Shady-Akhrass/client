import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
    const [activeItem, setActiveItem] = useState(null);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const location = useLocation();

    const sidebarItems = [
        {
            name: 'statistics',
            label: 'الاحصائيات',
            icon: 'https://img.icons8.com/material-outlined/24/null/statistics--v1.png',
            subItems: [
                { route: 'orphans-statistics', name: 'orphansStatistics', label: 'احصائيات الايتام' },
                { route: 'aids-statistics', name: 'aidsStatistics', label: 'احصائيات المساعدات' },
                { route: 'school-statistics', name: 'schoolStatistics', label: 'احصائيات المدرسة ' }
            ]
        },
        { name: 'orphans', label: 'الايتام', icon: 'https://img.icons8.com/material-outlined/24/null/user.png' },
        { name: 'aids', label: 'المساعدات', icon: 'https://img.icons8.com/material-outlined/24/null/box.png' },
        { name: 'teachers', label: 'المعلمين', icon: 'https://img.icons8.com/material-outlined/24/null/teacher.png' },
        { name: 'students', label: 'الطلاب', icon: 'https://img.icons8.com/material-outlined/24/null/students.png' },
        { name: 'employments', label: 'المقدمين للوظائف', icon: 'https://fonts.gstatic.com/s/i/materialicons/person_search/v12/24px.svg' },
        {
            name: 'shelters',
            label: 'مراكز النزوح',
            icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/home/v12/24px.svg'
        },
        {
            name: 'patients',
            label: 'المرضى',
            icon: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/accessible/v12/24px.svg'
        }
    ];

    useEffect(() => {
        const pathname = location.pathname;
        const pathParts = pathname.split('/').filter(Boolean);
        const itemName = pathParts[0];
        const subItemName = pathParts[1];

        if (itemName === 'statistics' && subItemName) {
            setActiveItem(`statistics/${subItemName}`);
            setIsDashboardOpen(true);
        } else {
            setActiveItem(itemName);
            setIsDashboardOpen(itemName === 'statistics');
        }

        const currentItem = sidebarItems.find(item => item.name === itemName);
        if (currentItem) {
            if (subItemName) {
                const subItem = currentItem.subItems?.find(sub => sub.route === subItemName);
                document.title = subItem ? subItem.label : currentItem.label;
            } else {
                document.title = currentItem.label;
            }
        }
    }, [location]);

    const handleClick = (itemName, subItemName = null) => {
        if (itemName === 'statistics') {
            setIsDashboardOpen(!isDashboardOpen);
            if (subItemName) {
                setActiveItem(`statistics/${subItemName}`);
            } else {
                setActiveItem('statistics');
            }
        } else {
            setActiveItem(itemName);
            setIsDashboardOpen(false);
        }

        const item = sidebarItems.find(item => item.name === itemName);
        if (subItemName) {
            const subItem = item.subItems?.find(sub => sub.route === subItemName);
            document.title = subItem ? subItem.label : item.label;
        } else {
            document.title = item.label;
        }
    };

    return (
        <aside className={`mt-4 fixed top-0 right-0 z-40 h-screen w-64 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
            <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
                <div className="px-2 py-2 flex items-center justify-center mb-6"></div>
                <ul className="space-y-2 font-medium">
                    {sidebarItems.map((item) => (
                        <li key={item.name} className="mx-1">
                            {item.subItems ? (
                                <div>
                                    <button
                                        className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${activeItem === item.name ? 'bg-purple-900 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                                        onClick={() => handleClick(item.name)}
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={item.icon}
                                                alt={item.label}
                                                className={`w-6 h-6 transition-colors ${activeItem === item.name ? 'filter invert brightness-0' : ''}`}
                                            />
                                            <span className="mr-3">{item.label}</span>
                                        </div>
                                        {isDashboardOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {isDashboardOpen && (
                                        <ul className="pr-4 mt-2 space-y-1">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        to={`/statistics/${subItem.route}`}
                                                        className={`flex items-center p-2 rounded-lg transition-colors ${activeItem === `statistics/${subItem.route}` ? 'bg-purple-700 text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                                                        onClick={() => handleClick(item.name, subItem.route)}
                                                    >
                                                        <span className="mr-3">{subItem.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
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
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;