import { useState, useCallback } from 'react';

const useFetchUserData = (showToast) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (userId) => {
        setLoading(true);
        try {
            // Retrieve the token from localStorage or sessionStorage
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            const response = await fetch(`https://forms-api.saiid.org/api/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            });

            const data = await response.json();
            if (response.ok) {
                setName(data.user.name);
                setEmail(data.user.email);
            } else {
                showToast('حدث خطأ أثناء جلب البيانات من الخادم', 'error');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            showToast('حدث خطأ أثناء جلب البيانات من الخادم', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    return { name, setName, email, setEmail, loading, fetchData };
};

export default useFetchUserData;
