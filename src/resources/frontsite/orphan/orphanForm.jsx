import React, { useState, useEffect, useRef } from 'react';

const OrphanForm = ({ formData, handleChange }) => {
    const [imagePreview, setImagePreview] = useState(formData.orphan_photo ? URL.createObjectURL(formData.orphan_photo) : '');
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const orphan_name = `${formData.orphan_first_name || ''} ${formData.orphan_fathers_name || ''} ${formData.orphan_grandfathers_name || ''} ${formData.orphan_last_name || ''}`.trim();
        handleChange({ target: { name: 'orphan_name', value: orphan_name } });
    }, [formData.orphan_first_name, formData.orphan_fathers_name, formData.orphan_grandfathers_name, formData.orphan_last_name]);

    const validateField = (name, value) => {
        switch (name) {
            case 'orphan_first_name':
            case 'orphan_fathers_name':
            case 'orphan_grandfathers_name':
            case 'orphan_last_name':
                if (!value.trim()) {
                    return 'هذا الحقل مطلوب.';
                }
                break;
            case 'orphan_id_number':
                if (!value.trim()) {
                    return 'رقم هوية اليتيم مطلوب.';
                }
                if (!/^\d+$/.test(value)) {
                    return 'رقم الهوية يجب أن يكون أرقامًا فقط.';
                }
                if (value.trim().length !== 9) {
                    return 'رقم الهوية يجب أن يكون 9 ارقام.';
                }
                break;
            case 'orphan_birth_date':
                if (!value) {
                    return 'تاريخ الميلاد مطلوب.';
                }
                const today = new Date();
                const twelveYearsAgo = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

                const enteredDate = new Date(value);

                if (enteredDate < twelveYearsAgo) {
                    return 'يجب أن يكون عمر الطفل أقل من 12 سنة.';
                }
                break;

            case 'health_status':
                if (!value) {
                    return 'الحالة الصحية مطلوبة.';
                }
                break;
            case 'original_address':
            case 'current_address':
                if (!value) {
                    return 'عنوان السكن مطلوب.';
                }
                break;
            case 'is_enrolled_in_memorization_center':
                if (!value) {
                    return 'يرجى تحديد ما إذا كان اليتيم ملتحقًا في مراكز التحفيظ.';
                }
                break;
            case 'orphan_gender':
                if (!value) {
                    return 'يرجى تحديد جنس اليتيم.'
                }
            case 'address_details':
                if (!value) {
                    return 'يرجى إدخال عنوان السكن بالتفصيل'
                }
            case 'orphan_photo':
                if (!value) {
                    return 'يرجى أدخال صورة اليتيم'
                }
                break;
            case 'number_of_brothers':
                if (!value.trim()) {
                    return 'يرجى أدخال عدد الأخوة الذكور'
                }
                if (isNaN(value) || value < 0) {
                    return 'يرجى إدخال عدد صحيح موجب.';
                }
            case 'number_of_sisters':
                if (!value.trim()) {
                    return 'يرجى أدخال عدد الأخوات الاناث'
                }
                if (isNaN(value) || value < 0) {
                    return 'يرجى إدخال عدد صحيح موجب.';
                }
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
                setErrors((prevErrors) => ({ ...prevErrors, orphan_photo: 'يرجى تحميل ملف صورة صالح.' }));
            } else if (file.size > 2048 * 1024) {  // Check if file size is greater than 2MB
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    orphan_photo: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت. يمكنك استخدام أداة مثل ' +
                        '<a href="https://compressjpeg.com/" target="_blank" rel="noopener noreferrer" style="color: blue; font-weight: bold;">Compress JPEG</a> لتصغير حجم الصورة.'
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, orphan_photo: '' }));  // Clear previous errors
                handleChange({ target: { name: 'orphan_photo', files: [file] } });
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
                setErrors((prevErrors) => ({ ...prevErrors, orphan_photo: 'يرجى تحميل ملف صورة صالح.' }));
            } else if (file.size > 2048 * 1024) {  // Check if file size is greater than 2MB
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    orphan_photo: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت. يمكنك استخدام أداة مثل ' +
                        '<a href="https://compressjpeg.com/" target="_blank" rel="noopener noreferrer" style="color: blue; font-weight: bold;">Compress JPEG</a> لتصغير حجم الصورة.'
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, orphan_photo: '' }));  // Clear previous errors
                handleChange({ target: { name: 'orphan_photo', files: [file] } });
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };



    const handleImageBoxClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="orphan-form">

            <h2 className="text-2xl font-semibold mb-4">بيانات اليتيم</h2>

            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700">الاسم الأول</label>
                    <input
                        type="text"
                        name="orphan_first_name"
                        value={formData.orphan_first_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.orphan_first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.orphan_first_name && <span className="text-red-500">{errors.orphan_first_name}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">اسم الأب</label>
                    <input
                        required
                        type="text"
                        name="orphan_fathers_name"
                        value={formData.orphan_fathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.orphan_fathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    />
                    {errors.orphan_fathers_name && <span className="text-red-500">{errors.orphan_fathers_name}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">اسم الجد</label>
                    <input
                        required
                        type="text"
                        name="orphan_grandfathers_name"
                        value={formData.orphan_grandfathers_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.orphan_grandfathers_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    />
                    {errors.orphan_grandfathers_name && <span className="text-red-500">{errors.orphan_grandfathers_name}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">اسم العائلة</label>
                    <input
                        type="text"
                        required
                        name="orphan_last_name"
                        value={formData.orphan_last_name}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.orphan_last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    />
                    {errors.orphan_last_name && <span className="text-red-500">{errors.orphan_last_name}</span>}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">رقم هوية اليتيم</label>
                <input
                    type="number"
                    name="orphan_id_number"
                    value={formData.orphan_id_number}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.orphan_id_number ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.orphan_id_number && <span className="text-red-500">{errors.orphan_id_number}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">تاريخ الميلاد</label>
                <input
                    type="date"
                    name="orphan_birth_date"
                    value={formData.orphan_birth_date}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.orphan_birth_date ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                />
                {errors.orphan_birth_date && <span className="text-red-500">{errors.orphan_birth_date}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">الجنس</label>
                <select
                    name="orphan_gender"
                    value={formData.orphan_gender}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.orphan_gender ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختار الجنس</option>
                    <option value="ذكر"> ذكر</option>
                    <option value="أنثى"> انثى</option>
                </select>
                {errors.orphan_gender && <span className="text-red-500">{errors.orphan_gender}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">الحالة الصحية</label>
                <select
                    name="health_status"
                    value={formData.health_status}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.health_status ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختار الحالة الصحية</option>
                    <option value="جيدة">جيدة</option>
                    <option value="مريض">مريض</option>
                </select>
                {errors.health_status && <span className="text-red-500">{errors.health_status}</span>}
            </div>

            {formData.health_status === 'مريض' && (
                <div className="mb-4">
                    <label className="block text-gray-700">وصف المرض (في حال وجود مرض)</label>
                    <textarea
                        name="disease_description"
                        value={formData.disease_description}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.disease_description ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    />
                    {errors.disease_description && <span className="text-red-500">{errors.disease_description}</span>}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700">عنوان السكن الاساسي</label>
                <select
                    name="original_address"
                    value={formData.original_address}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.original_address ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختار عنوان السكن الاساسي</option>
                    <option value="محافظة رفح">محافظة رفح</option>
                    <option value="محافظة خانيونس">محافظة خانيونس</option>
                    <option value="محافظة الوسطى">محافظة الوسطى</option>
                    <option value="محافظة غزة">محافظة غزة</option>
                    <option value="محافظة الشمال">محافظة الشمال</option>
                </select>
                {errors.original_address && <span className="text-red-500">{errors.original_address}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">عنوان السكن الحالي</label>
                <select
                    name="current_address"
                    value={formData.current_address}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.current_address ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">اختار عنوان السكن الحالي</option>
                    <option value="محافظة رفح">محافظة رفح</option>
                    <option value="محافظة خانيونس">محافظة خانيونس</option>
                    <option value="محافظة الوسطى">محافظة الوسطى</option>
                    <option value="محافظة غزة">محافظة غزة</option>
                    <option value="محافظة الشمال">محافظة الشمال</option>
                </select>
                {errors.current_address && <span className="text-red-500">{errors.current_address}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">عنوان السكن بالتفصيل</label>

                <textarea
                    name="address_details"
                    value={formData.address_details}
                    required
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.address_details ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                />
                {errors.address_details && <span className="text-red-500">{errors.address_details}</span>}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700">عدد الأخوة الذكور</label>
                    <input
                        type="number"
                        name="number_of_brothers"
                        value={formData.number_of_brothers}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.number_of_brothers ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.number_of_brothers && <span className="text-red-500">{errors.number_of_brothers}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">عدد الأخوات الاناث</label>
                    <input
                        type="number"
                        name="number_of_sisters"
                        value={formData.number_of_sisters}
                        onChange={handleFieldChange}
                        className={`mt-1 p-2 border ${errors.number_of_sisters ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                        required
                    />
                    {errors.number_of_sisters && <span className="text-red-500">{errors.number_of_sisters}</span>}
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">هل اليتيم ملتحق في مراكز التحفيظ</label>
                <select
                    name="is_enrolled_in_memorization_center"
                    value={formData.is_enrolled_in_memorization_center}
                    onChange={handleFieldChange}
                    className={`mt-1 p-2 border ${errors.is_enrolled_in_memorization_center ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full`}
                    required
                >
                    <option value="">هل اليتيم ملتحق في مراكز التحفيظ</option>
                    <option value="نعم">نعم</option>
                    <option value="لا">لا</option>
                </select>
                {errors.is_enrolled_in_memorization_center && <span className="text-red-500">{errors.is_enrolled_in_memorization_center}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">صورة اليتيم</label>
                <div
                    className="mb-4 p-4 border-dashed border-2 border-gray-300 rounded-lg text-center cursor-pointer "
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleImageBoxClick}
                >
                    <label className="block text-gray-700">صورة اليتيم </label>
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
                {errors.orphan_photo && (
                    <span className="text-red-500" dangerouslySetInnerHTML={{ __html: errors.orphan_photo }}></span>
                )}

            </div>
        </div>
    );
};

export default OrphanForm;
