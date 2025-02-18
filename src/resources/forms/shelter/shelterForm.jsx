import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ShelterForm = ({ formData, handleChange }) => {
    const [filePreview, setFilePreview] = useState(formData.excel_sheet ? formData.excel_sheet.name : '');
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const validateField = (name, value) => {
        switch (name) {
            case 'camp_name':
                if (!value.trim()) {
                    return 'اسم المخيم مطلوب.';
                }
                break;
            case 'governorate':
                if (!value) {
                    return 'المحافظة مطلوبة.';
                }
                break;
            case 'district':
                if (!value.trim()) {
                    return 'الحي مطلوب.';
                }
                break;
            case 'detailed_address':
                if (!value.trim()) {
                    return 'العنوان التفصيلي مطلوب.';
                }
                break;
            case 'tents_count':
            case 'families_count':
                if (!value.toString().trim()) {
                    return 'هذا الحقل مطلوب.';
                }
                if (isNaN(value) || value < 0) {
                    return 'يرجى إدخال عدد صحيح موجب.';
                }
                break;
            default:
                return '';
        }
    };

    const validateExcelFile = (file) => {
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!validTypes.includes(file.type)) {
            return 'يرجى تحميل ملف Excel صالح (.xls أو .xlsx)';
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return 'حجم الملف يجب أن يكون أقل من 5 ميجابايت';
        }

        return '';
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        handleChange(e);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateExcelFile(file);
            if (error) {
                setErrors((prevErrors) => ({ ...prevErrors, excel_sheet: error }));
                e.target.value = ''; // Reset file input
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, excel_sheet: '' }));
                setFilePreview(file.name);
                handleChange({
                    target: {
                        name: 'excel_sheet',
                        value: file,
                        type: 'file'
                    }
                });
            }
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const error = validateExcelFile(file);
            if (error) {
                setErrors((prevErrors) => ({ ...prevErrors, excel_sheet: error }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, excel_sheet: '' }));
                setFilePreview(file.name);
                handleChange({
                    target: {
                        name: 'excel_sheet',
                        value: file,
                        type: 'file'
                    }
                });
            }
        }
    };

    const handleFileBoxClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="shelter-form">
            <h2 className="text-2xl font-semibold mb-4">معلومات مركز نزوح</h2>

            <div className="mb-4">
                <label className="block text-gray-700">اسم المخيم</label>
                <input
                    type="text"
                    name="camp_name"
                    value={formData.camp_name}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.camp_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.camp_name && <span className="text-red-500">{errors.camp_name}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">المحافظة</label>
                <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.governorate ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختر المحافظة</option>
                    <option value="محافظة رفح">محافظة رفح</option>
                    <option value="محافظة خانيونس">محافظة خانيونس</option>
                    <option value="محافظة الوسطى">محافظة الوسطى</option>
                    <option value="محافظة غزة">محافظة غزة</option>
                    <option value="محافظة الشمال">محافظة الشمال</option>
                </select>
                {errors.governorate && <span className="text-red-500">{errors.governorate}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">الحي</label>
                <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.district && <span className="text-red-500">{errors.district}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">العنوان التفصيلي</label>
                <textarea
                    name="detailed_address"
                    value={formData.detailed_address}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.detailed_address ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.detailed_address && <span className="text-red-500">{errors.detailed_address}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700">عدد الخيام</label>
                    <input
                        type="number"
                        name="tents_count"
                        value={formData.tents_count}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.tents_count ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.tents_count && <span className="text-red-500">{errors.tents_count}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">عدد العائلات</label>
                    <input
                        type="number"
                        name="families_count"
                        value={formData.families_count}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.families_count ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.families_count && <span className="text-red-500">{errors.families_count}</span>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">ملف Excel للنازحين</label>
                <Link
                    to="/shelter-template"
                    className="text-blue-600 hover:text-blue-800 text-sm block mb-2"
                    target="_blank"
                >
                    تحميل نموذج Excel فارغ
                </Link>
                <div
                    className={`mb-4 p-4 border-dashed border-2 ${errors.excel_sheet ? 'border-red-500' : 'border-gray-300'} rounded-lg text-center cursor-pointer`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleFileBoxClick}
                >
                    {filePreview ? (
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span>{filePreview}</span>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-500">اسحب وأفلت ملف Excel هنا أو انقر لاختيار ملف</p>
                            <p className="text-sm text-gray-400 mt-2">(.xlsx أو .xls)</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                        required
                    />
                </div>
                {errors.excel_sheet && (
                    <span className="text-red-500">{errors.excel_sheet}</span>
                )}
            </div>
        </div>
    );
};

export default ShelterForm;
