import React, { useState } from 'react';

const GuardianForm = ({ formData, handleChange }) => {
    const [errors, setErrors] = useState({});

    // Function to validate individual fields
    const validateField = (name, value) => {
        switch (name) {
            case 'guardian_first_name':
            case 'guardian_fathers_name':
            case 'guardian_grandfathers_name':
            case 'guardian_last_name':
            case 'guardian_relationship':
                if (!value.trim()) {
                    return 'هذا الحقل مطلوب.';
                }
                break;
            case 'guardian_id_number':
                if (!value.trim()) {
                    return 'رقم هوية الوصي مطلوب.';
                }
                if (!/^\d+$/.test(value)) {
                    return 'رقم الهوية يجب أن يكون أرقامًا فقط.';
                }
                if (value.trim().length !== 9) {
                    return 'رقم الهوية يجب أن يكون 9 ارقام.';
                }
                break;
            case 'guardian_phone_number':
            case 'alternative_phone_number':
                if (!value.trim()) {
                    return 'رقم الجوال مطلوب.';
                }
                if (!/^\d{10}$/.test(value)) {
                    return 'رقم الجوال يجب أن يكون 10 أرقام.';
                }
                break;
            default:
                return '';
        }
    };

    // Function to handle field changes and validate
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        handleChange(e);
    };

    return (
        <div className="guardian-form">
            <h2 className="text-2xl font-semibold mb-4">بيانات الوصي</h2>
            <div className="mb-4 grid grid-cols-2 gap-4">

                <div className="mb-4">
                    <label className="block text-gray-700">الاسم الأول</label>
                    <input
                        type="text"
                        name="guardian_first_name"
                        value={formData.guardian_first_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.guardian_first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.guardian_first_name && <span className="text-red-500">{errors.guardian_first_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم الأب</label>
                    <input
                        type="text"
                        name="guardian_fathers_name"
                        value={formData.guardian_fathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.guardian_fathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.guardian_fathers_name && <span className="text-red-500">{errors.guardian_fathers_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم الجد</label>
                    <input
                        type="text"
                        name="guardian_grandfathers_name"
                        value={formData.guardian_grandfathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.guardian_grandfathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.guardian_grandfathers_name && <span className="text-red-500">{errors.guardian_grandfathers_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم العائلة</label>
                    <input
                        type="text"
                        name="guardian_last_name"
                        value={formData.guardian_last_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.guardian_last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.guardian_last_name && <span className="text-red-500">{errors.guardian_last_name}</span>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">رقم هوية الوصي</label>
                <input
                    type="number"
                    name="guardian_id_number"
                    value={formData.guardian_id_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.guardian_id_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.guardian_id_number && <span className="text-red-500">{errors.guardian_id_number}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">صلة قرابة الوصي</label>
                <input
                    type="text"
                    name="guardian_relationship"
                    value={formData.guardian_relationship}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.guardian_relationship ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.guardian_relationship && <span className="text-red-500">{errors.guardian_relationship}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">رقم الجوال</label>
                <input
                    type="text"
                    name="guardian_phone_number"
                    value={formData.guardian_phone_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.guardian_phone_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.guardian_phone_number && <span className="text-red-500">{errors.guardian_phone_number}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">رقم جوال بديل</label>
                <input
                    type="text"
                    name="alternative_phone_number"
                    value={formData.alternative_phone_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.alternative_phone_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.alternative_phone_number && <span className="text-red-500">{errors.alternative_phone_number}</span>}
            </div>
        </div>
    );
};

export default GuardianForm;
