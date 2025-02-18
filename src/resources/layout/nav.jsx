import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import useFetchUserData from '../../hooks/fetchUser.jsx';

const Nav = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const showToast = useCallback((message, type) => console.log(message, type), []);
    const { name, loading, fetchData } = useFetchUserData(showToast);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userNameRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        if (user?.id) {
            fetchData(user.id);
        }
    }, [user?.id, fetchData]);

    const dropdownWidth = userNameRef.current ? userNameRef.current.offsetWidth + 20 * 3.5 : 'auto';

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
                                        {loading ? (
                                            <div className="w-16 h-4 bg-gray-300 animate-pulse rounded-md"></div> // Skeleton loader for username
                                        ) : (
                                            name
                                        )}
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
        </>
    );
};

export default Nav;
