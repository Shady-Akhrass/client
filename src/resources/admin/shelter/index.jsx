import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Toast from '../../../../components/toast';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const Shelters = () => {
  const [shelters, setShelters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalShelters, setTotalShelters] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [isLoading, setIsLoading] = useState(false);

  const fetchShelters = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('https://forms-api.saiid.org/api/shelters', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { searchQuery, perPage, page: currentPage }
      });

      if (Array.isArray(response.data.shelters)) {
        setShelters(response.data.shelters);
        setTotalShelters(response.data.totalShelters);
        setTotalPages(response.data.totalPages);
      } else {
        setShelters([]);
        setTotalShelters(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching shelters:', error);
      setToast({ message: 'خطأ في جلب بيانات مراكز النزوح، يرجى المحاولة مرة أخرى.', type: 'error', isVisible: true });
      setShelters([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [searchQuery, perPage, currentPage]);

  return (
    <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
      <div className="container bg-white shadow-lg rounded-xl mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-20" style={{ direction: 'rtl' }}>
        <div className="card-header flex flex-col sm:flex-row justify-between items-center mb-6 px-2 sm:px-5">
          <h2 className="card-title font-bold text-2xl sm:text-3xl mb-4 sm:mb-0 text-gray-800">بيانات مراكز النزوح</h2>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="البحث عن مركز نزوح"
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
                <th className="p-3 text-sm font-semibold text-gray-600">اسم المركز نزوح</th>
                <th className="p-3 text-sm font-semibold text-gray-600">المحافظة</th>
                <th className="p-3 text-sm font-semibold text-gray-600">عدد النازحين</th>
                <th className="p-3 text-sm font-semibold text-gray-600">عدد الخيام</th>
                <th className="p-3 text-sm font-semibold text-gray-600"> اسم مدير المخيم</th>
                <th className="p-3 text-sm font-semibold text-gray-600"> رقم مدير المخيم </th>
                <th className="p-3 text-sm font-semibold text-gray-600">  اسم نائب مديرالمخيم</th>
                <th className="p-3 text-sm font-semibold text-gray-600"> رقم نائب مديرالمخيم</th>
                <th className="p-3 text-sm font-semibold text-gray-600">ملف الاكسيل</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="3" className="text-center p-4">جارٍ تحميل البيانات...</td></tr>
              ) : shelters.length === 0 ? (
                <tr><td colSpan="3" className="text-center p-4">لا توجد بيانات متاحة</td></tr>
              ) : (
                shelters.map((shelter) => (
                  <tr key={shelter.manager_id_number} className="text-center border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">{shelter.camp_name}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.governorate}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.families_count}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.tents_count}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.manager_name}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.manager_phone}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.deputy_manager_name}</td>
                    <td className="p-3 text-sm text-gray-700">{shelter.deputy_manager_phone}</td>
                    <td className="p-3 text-sm text-gray-700">
                      {shelter.excel_sheet ? (
                        <a
                          href={`https://forms-api.saiid.org/api/excel/${shelter.manager_id_number}`}
                          download
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          target="_blank"
                        >
                          تحميل الملف
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
          <span className="mx-2 text-gray-700">صفحة {currentPage} من {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shelters;
