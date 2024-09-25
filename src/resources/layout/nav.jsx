import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import useFetchUserData from '../../hooks/fetchUser.jsx';

const Nav = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const showToast = useCallback((message, type) => console.log(message, type), []);
    const { name, loading, fetchData } = useFetchUserData(showToast);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [notifications, setNotifications] = useState([]);
    // const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    // Ref to measure the user's name width
    const userNameRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // const toggleNotificationPanel = () => {
    //     setIsNotificationPanelOpen(!isNotificationPanelOpen);
    // };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    // Mock function to fetch notifications
    // const fetchNotifications = () => {
    //     // This should be replaced with an actual API call
    //     setNotifications([
    //         { id: 1, message: 'اشعار جديد قادم', read: false },
    //         { id: 2, message: 'التقرير جاهز', read: true },
    //         { id: 3, message: 'اتم الطالب احمد حفظ القرآن الكريم', read: false },
    //     ]);
    // };

    // useEffect(() => {
    //     fetchNotifications();
    // }, []);

    useEffect(() => {
        if (user?.id) {
            fetchData(user.id);
        }
    }, [user?.id, fetchData]);

    // const unreadCount = notifications.filter(n => !n.read).length;
    const dropdownWidth = userNameRef.current ? userNameRef.current.offsetWidth + 20 * 3.5 : 'auto'; // Adding padding

    return (
        <>
            <nav className="fixed left-0 top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="py-2 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={toggleSidebar}
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                dir="rtl"
                            >
                                <span className="sr-only">تبديل الشريط الجانبي</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center">
                            {/* <div className="relative mr-4">
                                <button
                                    onClick={toggleNotificationPanel}
                                    className="text-black-500 hover:text-yellow-300 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 22 22" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadCount}</span>
                                    )}
                                </button>
                            </div> */}

                            <div className="relative flex items-center">
                                <button
                                    type="button"
                                    className={`flex items-center text-sm font-medium text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 border-2 ${isDropdownOpen ? 'border-purple-500' : 'border-transparent'} px-3 py-2`}
                                    id="user-menu-button"
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                    onClick={toggleDropdown}
                                >
                                    <span className="font-bold mr-2 ml-2" ref={userNameRef}>
                                        {loading ? '...تحميل' : name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                                        aria-hidden="true"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                        tabIndex="-1"
                                        style={{ top: '100%', width: dropdownWidth }}
                                    >
                                        <Link
                                            to={`/logout`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            tabIndex="-1"
                                            id="user-menu-item-0"
                                        >
                                            تسجيل الخروج
                                        </Link>
                                        <Link
                                            to={`/edit/${user?.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                                            role="menuitem"
                                            tabIndex="-1"
                                            id="user-menu-item-1"
                                        >
                                            الملف الشخصي
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Notification Panel */}
            {/* <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isNotificationPanelOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">الإشعارات</h2>
                        <button onClick={toggleNotificationPanel} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`py-2 border-b ${notification.read ? 'opacity-50' : ''}`}>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                    ))}
                </div>
            </div> */}
        </>
    );
};

export default Nav;
