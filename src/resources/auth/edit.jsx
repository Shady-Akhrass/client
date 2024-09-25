import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../components/toast.jsx';
import useFetchUserData from '../../hooks/fetchUser.jsx';

function EditRegistration() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type) => {
        setToast({ message, type });
    }, []);

    const { name, setName, email, setEmail, loading, fetchData } = useFetchUserData(showToast);

    useEffect(() => {
        fetchData(userId);
    }, [userId, fetchData]);

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(`https://forms-api.saiid.org/api/register/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to update email');
            }

            const updatedUser = await response.json();
            setEmail(updatedUser.email);
            showToast('تم تحديث البريد الإلكتروني بنجاح', 'success');
        } catch (error) {
            console.error('Error updating email:', error);
            showToast('فشل تحديث البريد الإلكتروني', 'error');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            showToast('الكلمتان غير متطابقتين', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(`https://forms-api.saiid.org/api/register/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            showToast('تم تحديث كلمة المرور بنجاح', 'success');
            setPassword('');
            setPasswordConfirm('');
        } catch (error) {
            console.error('Error updating password:', error);
            showToast('فشل تحديث كلمة المرور', 'error');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await fetch(`https://forms-api.saiid.org/api/register/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setName(updatedUser.name);
            showToast('تم تحديث الملف الشخصي بنجاح', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('فشل تحديث الملف الشخصي', 'error');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
    }

    return (
        <div className="bg-gray-100 w-full min-w-full py-6 px-4 sm:px-6 lg:px-8" dir="rtl">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Profile Information */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">معلومات الملف الشخصي</h2>
                        <p className="mt-1 text-sm text-gray-600">قم بتحديث معلومات ملفك الشخصي.</p>
                        <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">الاسم</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full h-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-purple-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Email Information */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">معلومات البريد الإلكتروني</h2>
                        <p className="mt-1 text-sm text-gray-600">قم بتحديث عنوان البريد الإلكتروني الخاص بحسابك.</p>
                        <form onSubmit={handleEmailUpdate} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full h-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-purple-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Update */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">تغيير كلمة المرور</h2>
                        <p className="mt-1 text-sm text-gray-600">تأكد من أن حسابك يستخدم كلمة مرور طويلة وعشوائية للبقاء آمنًا.</p>
                        <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">كلمة المرور الجديدة</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full h-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                                <input
                                    type="password"
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="mt-1 block w-full h-10 pr-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-purple-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditRegistration;
