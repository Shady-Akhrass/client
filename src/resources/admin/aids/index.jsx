import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../../../components/toast';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const aids = () => {
    const [aids, setaids] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalaids, setTotalaids] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const fetchaids = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get('https://forms-api.saiid.org/api/aids', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: { searchQuery, perPage, page: currentPage }
            });

            if (Array.isArray(response.data.aids)) {
                setaids(response.data.aids);
                setTotalaids(response.data.totalaids);
                setTotalPages(response.data.totalPages);
            } else {
                setaids([]);
                setTotalaids(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching aids:', error);
            setToast({ message: 'خطأ في جلب بيانات , يرجى المحاولة مرة أخرى.', type: 'error', isVisible: true });
            setaids([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchaids();
    }, [searchQuery, perPage, currentPage]);

    const handleDownloadExcel = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get('https://forms-api.saiid.org/api/aids/export', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'aids.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            setToast({ message: 'خطأ في تحميل ملف Excel، يرجى المحاولة مرة أخرى.', type: 'error', isVisible: true });
        }
    };

    const sortedaids = React.useMemo(() => {
        return [...aids].sort((a, b) => {
            if (!sortConfig.key) return 0;
            const aValue = sortConfig.key.split('.').reduce((o, i) => o[i], a);
            const bValue = sortConfig.key.split('.').reduce((o, i) => o[i], b);

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [aids, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="p-3">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
            </td>
        </tr>
    );

    return (
        <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
            <div className="container bg-white shadow-lg rounded-xl mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-20" style={{ direction: 'rtl' }}>
                <div className="card-header flex flex-col sm:flex-row justify-between items-center mb-6 px-2 sm:px-5">
                    <h2 className="card-title font-bold text-2xl sm:text-3xl mb-4 sm:mb-0 text-gray-800">بيانات المسجلين للمساعدات </h2>
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center justify-center p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                    >
                        <Download size={20} className="mr-2" />
                        تحميل كملف Excel
                    </button>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="البحث عن شخص"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="card-body overflow-x-auto bg-white rounded-lg shadow">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-center">
                                <th onClick={() => requestSort('id_number')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">رقم هوية رب الأسرة </th>
                                <th onClick={() => requestSort('name')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">اسم رب الأسرة</th>
                                <th onClick={() => requestSort('birth_date')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">تاريخ الميلاد</th>
                                <th onClick={() => requestSort('job')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"> عمل رب الأسرة</th>
                                <th onClick={() => requestSort('original_address')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">العنوان الأصلي</th>
                                <th onClick={() => requestSort('health_status')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"> الحالة الصحية</th>
                                <th onClick={() => requestSort('guardian_phone_number')} className="p-3 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"> رقم الهاتف </th>

                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array(perPage).fill().map((_, index) => (
                                    <SkeletonRow key={index} />
                                ))
                            ) : sortedaids.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">لا توجد بيانات متاحة</td>
                                </tr>
                            ) : (
                                sortedaids.map((aid) => (
                                    <tr key={aid.aid_id_number || aid._id} className="text-center border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-700">{aid.id_number}</td>
                                        <td className="p-3 text-sm text-gray-700">{aid.name}</td>
                                        <td className="p-3 text-sm text-gray-700">{formatDate(aid.birth_date)}</td>
                                        <td className="p-3 text-sm text-gray-700">{aid.job}</td>
                                        <td className="p-3 text-sm text-gray-700">{aid.original_address}</td>
                                        <td className="p-3 text-sm text-gray-700">{aid.health_status}</td>
                                        <td className="p-3 text-sm text-gray-700">{aid.guardian_phone_number}</td>
                                        {/* <td className="p-3">
                                            <img
                                                src={`https://forms-api.saiid.org/api/image/${aid.aid_id_number}`}
                                                alt="aid's photo"
                                                className="h-16 w-16 object-cover rounded-full mx-auto"
                                            />
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer flex flex-col sm:flex-row justify-between items-center mt-6 px-2 sm:px-5" dir='rtl'>
                    <div className="mb-4 sm:mb-0 flex items-center">
                        <span className="mr-2">عرض</span>
                        <select
                            className="p-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                        </select>
                        <span className="ml-2">بيانات في كل صفحة</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out disabled:opacity-50"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <ChevronRight size={20} />
                        </button>
                        <span className="text-sm text-gray-600">
                            صفحة {currentPage} من {totalPages}
                        </span>
                        <button
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out disabled:opacity-50"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {toast.isVisible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isVisible: false })} />}
        </div>
    );
};

export default aids;