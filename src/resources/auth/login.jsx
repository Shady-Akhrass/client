import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ViteLogo from '../../assets/images/logo.jpg';

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Set the page title when the component mounts
        document.title = 'صفحة تسجيل الدخول';
    }, []); // Empty dependency array means this effect runs once when the component mounts

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Show the loader when fetching starts

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, remember }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data, remember);
                navigate('/dashboard');
            } else {
                const errorText = await response.text();
                console.error('Login failed', response.status, errorText);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-200 to-blue-200" dir="rtl">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg relative">
                {/* Logo and Title */}
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-md mt-8">
                        <img src={ViteLogo} alt="Vite Logo" className="w-28 h-28 rounded-full" />
                    </div>
                </div>

                {/* Login form */}
                <h2 className="text-2xl font-bold text-center text-blue-700 mt-32">تسجيل الدخول إلى حسابك</h2>
                <form onSubmit={handleSubmit} className="space-y-6 mt-24">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="البريد الإلكتروني"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-800">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="كلمة المرور"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="remember" className="mr-2 text-sm text-gray-800">تذكرني</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                    </button>
                    <div className="text-center">
                        <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">نسيت كلمة المرور؟</a>
                    </div>
                </form>
                {/* Skeleton Loader */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
