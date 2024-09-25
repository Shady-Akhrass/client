import React, { useState } from 'react';

const MotherForm = ({ formData, handleChange }) => {
    const [errors, setErrors] = useState({});
    const [isMotherDeceased, setIsMotherDeceased] = useState(false);
    const validateField = (name, value) => {
        switch (name) {
            case 'mother_first_name':
            case 'mother_fathers_name':
            case 'mother_grandfathers_name':
            case 'mother_last_name':
                if (!value.trim()) {
                    return 'هذا الحقل مطلوب.';
                }
                break;
            case 'mother_id_number':
                if (!value.trim()) {
                    return 'رقم هوية الام مطلوبة.';
                }
                if (!/^\d+$/.test(value)) {
                    return 'رقم الهوية يجب أن يكون أرقامًا فقط.';
                }
                if (value.trim().length !== 9) {
                    return 'رقم الهوية يجب أن يكون 9 ارقام.';
                }
                break;
            case 'mother_birth_date':
                if (!value) {
                    return 'تاريخ الميلاد مطلوب.';
                }
                break;
            case 'is_mother_deceased':
                if (!value) {
                    return 'هذا الحقل مطلوب';
                }
                break;
            case 'mother_status':
                if (!value) {
                    return 'يرجى اختبار حالة الأم.';
                }
                break;
            case 'mother_job':
                if (!value) {
                    return 'وظيفة الأم مطلوبة.';
                }
                break;
            default:
                return '';
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        handleChange(e);
    };


    return (
        <div className="mother-form">
            <h2 className="text-2xl font-semibold mb-4">بيانات الأم</h2>
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700">الاسم الأول</label>
                    <input
                        type="text"
                        name="mother_first_name"
                        value={formData.mother_first_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.mother_first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.mother_first_name && <span className="text-red-500">{errors.mother_first_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم الأب</label>
                    <input
                        type="text"
                        name="mother_fathers_name"
                        value={formData.mother_fathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.mother_fathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.mother_fathers_name && <span className="text-red-500">{errors.mother_fathers_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم الجد</label>
                    <input
                        type="text"
                        name="mother_grandfathers_name"
                        value={formData.mother_grandfathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.mother_grandfathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.mother_grandfathers_name && <span className="text-red-500">{errors.mother_grandfathers_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم العائلة</label>
                    <input
                        type="text"
                        name="mother_last_name"
                        value={formData.mother_last_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.mother_last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.mother_last_name && <span className="text-red-500">{errors.mother_last_name}</span>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">رقم هوية الأم</label>
                <input
                    type="number"
                    name="mother_id_number"
                    value={formData.mother_id_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.mother_id_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.mother_id_number && <span className="text-red-500">{errors.mother_id_number}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">تاريخ ميلاد الأم</label>
                <input
                    type="date"
                    name="mother_birth_date"
                    value={formData.mother_birth_date}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.mother_birth_date ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.mother_birth_date && <span className="text-red-500">{errors.mother_birth_date}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">هل الأم متوفاه</label>
                <select
                    name="is_mother_deceased"
                    value={formData.is_mother_deceased}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.is_mother_deceasede ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختار نعم أو لا</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                </select>
                {errors.is_mother_deceased && <span className="text-red-500">{errors.is_mother_deceased}</span>}
            </div>

            {formData.is_mother_deceased === 'نعم' && (
                <div className="mb-4">
                    <label className="block text-gray-700">تاريخ وفاة الأم</label>
                    <input
                        type="date"
                        name="mother_death_date"
                        value={formData.mother_death_date}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.mother_death_date ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    />
                    {errors.mother_death_date && <span className="text-red-500">{errors.mother_death_date}</span>}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700">الحالة الاجتماعية للأم</label>
                <select
                    name="mother_status"
                    value={formData.mother_status}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.mother_status ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختار الحالة الاجتماعية</option>
                    <option value="أرملة">أرملة</option>
                    <option value="متزوجة">متزوجة</option>
                </select>
                {errors.mother_status && <span className="text-red-500">{errors.mother_status}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">مهنة الأم</label>
                <input
                    type="text"
                    name="mother_job"
                    value={formData.mother_job}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.mother_job ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                />
                {errors.mother_job && <span className="text-red-500">{errors.mother_job}</span>}
            </div>
        </div>

    );
};

export default MotherForm;
