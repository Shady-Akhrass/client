import React, { useState } from 'react';

const DeputyManagerForm = ({ formData, handleChange }) => {
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case 'deputy_manager_id_number':
                if (!value.trim()) {
                    return 'رقم هوية نائب المدير مطلوب.';
                }
                if (!/^\d{9}$/.test(value)) {
                    return 'رقم الهوية يجب أن يتكون من 9 أرقام.';
                }
                break;
            case 'deputy_manager_name':
                if (!value.trim()) {
                    return 'اسم نائب المدير مطلوب.';
                }
                break;
            case 'deputy_manager_phone':
                if (!value.trim()) {
                    return 'رقم هاتف نائب المدير مطلوب.';
                }
                if (!/^05\d{8}$/.test(value)) {
                    return 'رقم الهاتف يجب أن يبدأ ب 05 ويتكون من 10 أرقام.';
                }
                break;
            case 'deputy_manager_job_description':
                if (!value.trim()) {
                    return 'الوصف الوظيفي لنائب المدير مطلوب.';
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
        <div className="deputy-manager-form">
            <h2 className="text-2xl font-semibold mb-4">معلومات نائب مدير مركز النزوح</h2>

            <div className="mb-4">
                <label className="block text-gray-700">رقم هوية نائب المدير</label>
                <input
                    type="text"
                    name="deputy_manager_id_number"
                    value={formData.deputy_manager_id_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.deputy_manager_id_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.deputy_manager_id_number && <span className="text-red-500">{errors.deputy_manager_id_number}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">اسم نائب المدير رباعي</label>
                <input
                    type="text"
                    name="deputy_manager_name"
                    value={formData.deputy_manager_name}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.deputy_manager_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.deputy_manager_name && <span className="text-red-500">{errors.deputy_manager_name}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700">رقم هاتف نائب المدير</label>
                    <input
                        type="tel"
                        name="deputy_manager_phone"
                        value={formData.deputy_manager_phone}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.deputy_manager_phone ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.deputy_manager_phone && <span className="text-red-500">{errors.deputy_manager_phone}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">رقم هاتف بديل لنائب المدير</label>
                    <input
                        type="tel"
                        name="deputy_manager_alternative_phone"
                        value={formData.deputy_manager_alternative_phone}
                        onChange={handleFieldChange}
                        className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">الوصف الوظيفي لنائب المدير</label>
                <textarea
                    name="deputy_manager_job_description"
                    value={formData.deputy_manager_job_description}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.deputy_manager_job_description ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.deputy_manager_job_description && <span className="text-red-500">{errors.deputy_manager_job_description}</span>}
            </div>
        </div>
    );
};

export default DeputyManagerForm;
