import React, { useState } from 'react';

const ManagerForm = ({ formData, handleChange }) => {
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'manager_id_number':
                if (!value.trim()) {
                    return 'رقم هوية المدير مطلوب.';
                }
                if (!/^\d{9}$/.test(value)) {
                    return 'رقم الهوية يجب أن يتكون من 9 أرقام.';
                }
                break;
            case 'manager_name':
                if (!value.trim()) {
                    return 'اسم المدير مطلوب.';
                }
                break;
            case 'manager_phone':
                if (!value.trim()) {
                    return 'رقم هاتف المدير مطلوب.';
                }
                if (!/^05\d{8}$/.test(value)) {
                    return 'رقم الهاتف يجب أن يبدأ ب 05 ويتكون من 10 أرقام.';
                }
                break;
            case 'manager_job_description':
                if (!value.trim()) {
                    return 'الوصف الوظيفي للمدير مطلوب.';
                }
                break;
            default:
                return '';
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        handleChange(e);
    };

    return (
        <div className="manager-form">
            <h2 className="text-2xl font-semibold mb-4">معلومات مدير مركز النزوح</h2>

            <div className="mb-4">
                <label className="block text-gray-700">رقم هوية المدير</label>
                <input
                    type="text"
                    name="manager_id_number"
                    value={formData.manager_id_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.manager_id_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.manager_id_number && <span className="text-red-500">{errors.manager_id_number}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">اسم المدير رباعي</label>
                <input
                    type="text"
                    name="manager_name"
                    value={formData.manager_name}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.manager_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.manager_name && <span className="text-red-500">{errors.manager_name}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700">رقم هاتف المدير</label>
                    <input
                        type="tel"
                        name="manager_phone"
                        value={formData.manager_phone}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.manager_phone ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.manager_phone && <span className="text-red-500">{errors.manager_phone}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">رقم هاتف بديل</label>
                    <input
                        type="tel"
                        name="manager_alternative_phone"
                        value={formData.manager_alternative_phone}
                        onChange={handleFieldChange}
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">الوصف الوظيفي للمدير</label>
                <textarea
                    name="manager_job_description"
                    value={formData.manager_job_description}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.manager_job_description ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.manager_job_description && <span className="text-red-500">{errors.manager_job_description}</span>}
            </div>
        </div>
    );
};

export default ManagerForm;
