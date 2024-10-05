import React, { useState, useEffect, useRef } from 'react';

const FatherForm = ({ formData, handleChange }) => {
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(formData.death_certificate ? URL.createObjectURL(formData.death_certificate) : '');
    const fileInputRef = useRef(null);

    const validateField = (name, value) => {
        switch (name) {
            case 'father_first_name':
            case 'father_fathers_name':
            case 'father_grandfathers_name':
            case 'father_last_name':
                if (!value.trim()) {
                    return 'هذا الحقل مطلوب.';
                }
                break;
            case 'deceased_father_birth_date':
                if (!value) {
                    return 'تاريخ الميلاد مطلوب.';
                }
                break;
            case 'death_date':
                if (!value) {
                    return 'تاريخ الوفاة مطلوب.';
                }
                break;
            case 'death_cause':
                if (!value) {
                    return 'يرجى تحديد ما سبب الوفاة.';
                }
                break;
            case 'previous_father_job':
                if (!value) {
                    return 'يرجى تحديد الوظيفة السابقة للأب.';
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    death_certificate: 'يرجى تحميل ملف صورة صالح.'
                }));
            } else if (file.size > 2048 * 1024) {  // Check if file size is greater than 2MB
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    death_certificate: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت. يمكنك استخدام أداة مثل ' +
                        '<a href="https://compressjpeg.com/" target="_blank" rel="noopener noreferrer" style="color: blue; font-weight: bold;">Compress JPEG</a> لتصغير حجم الصورة.'
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, death_certificate: '' }));  // Clear previous errors
                handleChange({ target: { name: 'death_certificate', files: [file] } });
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    death_certificate: 'يرجى تحميل ملف صورة صالح.'
                }));
            } else if (file.size > 2048 * 1024) {  // Check if file size is greater than 2MB
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    death_certificate: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت. يمكنك استخدام أداة مثل ' +
                        '<a href="https://compressjpeg.com/" target="_blank" rel="noopener noreferrer" style="color: blue; font-weight: bold;">Compress JPEG</a> لتصغير حجم الصورة.'
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, death_certificate: '' }));  // Clear previous errors
                handleChange({ target: { name: 'death_certificate', files: [file] } });
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleImageBoxClick = () => {
        fileInputRef.current.click();
    };
    return (
        <div className="father-form">
            <h2 className="text-2xl font-semibold mb-4">بيانات الأب</h2>
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700">الاسم الأول</label>
                    <input
                        type="text"
                        name="father_first_name"
                        value={formData.father_first_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.father_first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.father_first_name && <span className="text-red-500">{errors.father_first_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم الأب</label>
                    <input
                        type="text"
                        name="father_fathers_name"
                        value={formData.father_fathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.father_fathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.father_fathers_name && <span className="text-red-500">{errors.father_fathers_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم الجد</label>
                    <input
                        type="text"
                        name="father_grandfathers_name"
                        value={formData.father_grandfathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.father_grandfathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.father_grandfathers_name && <span className="text-red-500">{errors.father_grandfathers_name}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">اسم العائلة</label>
                    <input
                        type="text"
                        name="father_last_name"
                        value={formData.father_last_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.father_last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.father_last_name && <span className="text-red-500">{errors.father_last_name}</span>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">تاريخ ميلاد الأب</label>
                <input
                    type="date"
                    name="deceased_father_birth_date"
                    value={formData.deceased_father_birth_date}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.deceased_father_birth_date ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.deceased_father_birth_date && <span className="text-red-500">{errors.deceased_father_birth_date}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">تاريخ وفاة الأب</label>
                <input
                    type="date"
                    name="death_date"
                    value={formData.death_date}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.death_date ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.death_date && <span className="text-red-500">{errors.death_date}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">سبب وفاة الأب</label>
                <select
                    name="death_cause"
                    value={formData.death_cause}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.death_cause ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">سبب الوفاة</option>
                    <option value="شهيد حرب">شهيد حرب</option>
                    <option value="وفاة طبيعية">وفاة طبيعية</option>
                    <option value="وفاة بسبب المرض">وفاة بسبب المرض</option>
                </select>
                {errors.death_cause && <span className="text-red-500">{errors.death_cause}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700"> عمل الأب السابق</label>
                <input
                    type="text"
                    name="previous_father_job"
                    value={formData.previous_father_job}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.previous_father_job ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                />
                {errors.previous_father_job && <span className="text-red-500">{errors.previous_father_job}</span>}
            </div>
            <div className='mb-4'>
                <label className="block text-gray-700">صورة شهادة وفاة الأب</label>
                <div
                    className="mb-4 p-4 border-dashed border-2 border-gray-300 rounded-lg text-center cursor-pointer "
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleImageBoxClick}
                >
                    <label className="block text-gray-700">صورة شهادة وفاة الأب </label>
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mt-2 mx-auto max-w-[100px] max-h-[200px]" />
                    ) : (
                        <span className="text-gray-500">اسحب وافلت الصورة هنا أو انقر لاختيار صورة</span>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                        required
                    />
                </div>
                {errors.death_certificate && (
                    <span className="text-red-500" dangerouslySetInnerHTML={{ __html: errors.death_certificate }}></span>
                )}

            </div>
        </div>
    );
};

export default FatherForm;
