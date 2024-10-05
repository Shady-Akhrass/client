import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import imageCompression from 'browser-image-compression';
import OrphanForm from './orphanForm';
import FatherForm from './fatherForm';
import MotherForm from './motherForm';
import GuardianForm from './guardianForm';
import ApprovalForm from './approvalForm';
import ProgressBar from '../base/ProgressBar';
import NavigationButtons from '../base/NavigationButtons';
import SuccessMessage from '../base/SuccessMessage';
import ErrorMessage from '../base/ErrorMessage';
import Alert from '../base/Alert';
import Logo from '../base/Logo';

function Main() {
    const sections = ['بيانات اليتيم', 'بيانات الأب', 'بيانات الأم', 'بيانات الوصي', 'التعهد'];
    const totalSteps = sections.length;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        orphan: {
            orphan_id_number: '',
            orphan_first_name: '',
            orphan_fathers_name: '',
            orphan_grandfathers_name: '',
            orphan_last_name: '',
            orphan_full_name: '',
            orphan_birth_date: '',
            orphan_gender: '',
            health_status: '',
            disease_description: '',
            original_address: '',
            current_address: '',
            address_details: '',
            number_of_brothers: '',
            number_of_sisters: '',
            is_enrolled_in_memorization_center: '',
            orphan_photo: '',
        },
        guardian: {
            guardian_id_number: '',
            guardian_first_name: '',
            guardian_fathers_name: '',
            guardian_grandfathers_name: '',
            guardian_last_name: '',
            guardian_full_name: '',
            guardian_relationship: '',
            guardian_phone_number: '',
            alternative_phone_number: '',
        },
        father: {
            father_first_name: '',
            father_fathers_name: '',
            father_grandfathers_name: '',
            father_last_name: '',
            deceased_father_full_name: '',
            deceased_father_birth_date: '',
            death_date: '',
            death_cause: '',
            previous_father_job: '',
            death_certificate: '',
        },
        mother: {
            mother_first_name: '',
            mother_fathers_name: '',
            mother_grandfathers_name: '',
            mother_last_name: '',
            mother_full_name: '',
            mother_id_number: '',
            is_mother_deceased: '',
            mother_birth_date: '',
            mother_death_date: '',
            mother_status: '',
            mother_job: '',

        },
        approval: {
            data_approval_name: '',
            isChecked: false
        }
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({
        orphan_photo: 0,
        death_certificate: 0
    });
    const handleChange = async (section, e) => {
        const { name, files, type, checked, value } = e.target;
        if (files && files[0]) {
            const file = files[0];

            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                setFormData((prevState) => ({
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        [name]: compressedFile,
                    },
                }));
            } catch (error) {
                console.error('Error compressing the image:', error);
            }
        } else if (type === 'checkbox') {
            setFormData((prevState) => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [name]: checked,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [name]: value,
                },
            }));
        }
    };

    const concatenateNames = (nameObj) => {
        return [
            nameObj.first_name,
            nameObj.fathers_name,
            nameObj.grandfathers_name,
            nameObj.last_name,
        ].filter(Boolean).join(' ');
    };

    const handleNext = () => {
        if (currentStep === 0) {
            const orphanFullName = concatenateNames({
                first_name: formData.orphan.orphan_first_name,
                fathers_name: formData.orphan.orphan_fathers_name,
                grandfathers_name: formData.orphan.orphan_grandfathers_name,
                last_name: formData.orphan.orphan_last_name,
            });

            setFormData((prevState) => ({
                ...prevState,
                orphan: {
                    ...prevState.orphan,
                    orphan_full_name: orphanFullName,
                },
            }));
        }

        if (currentStep === 1) {
            const fatherFullName = concatenateNames({
                first_name: formData.father.father_first_name,
                fathers_name: formData.father.father_fathers_name,
                grandfathers_name: formData.father.father_grandfathers_name,
                last_name: formData.father.father_last_name,
            });

            setFormData((prevState) => ({
                ...prevState,
                father: {
                    ...prevState.father,
                    deceased_father_full_name: fatherFullName,
                },
            }));
        }

        if (currentStep === 2) {
            const motherFullName = concatenateNames({
                first_name: formData.mother.mother_first_name,
                fathers_name: formData.mother.mother_fathers_name,
                grandfathers_name: formData.mother.mother_grandfathers_name,
                last_name: formData.mother.mother_last_name,
            });

            setFormData((prevState) => ({
                ...prevState,
                mother: {
                    ...prevState.mother,
                    mother_full_name: motherFullName,
                },
            }));
        }

        if (currentStep === 3) {
            const guardianFullName = concatenateNames({
                first_name: formData.guardian.guardian_first_name,
                fathers_name: formData.guardian.guardian_fathers_name,
                grandfathers_name: formData.guardian.guardian_grandfathers_name,
                last_name: formData.guardian.guardian_last_name,
            });

            setFormData((prevState) => ({
                ...prevState,
                guardian: {
                    ...prevState.guardian,
                    guardian_full_name: guardianFullName,
                },
            }));
        }

        if (currentStep < sections.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.approval.isChecked) {
            alert('يجب الموافقة على التعهد.');
            return;
        }

        const data = new FormData();
        for (const section in formData) {
            for (const key in formData[section]) {
                data.append(key, formData[section][key]);
            }
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post('https://forms-api.saiid.org/api/orphans', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                    // Update the correct file progress based on the field name
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        orphan_photo: formData.orphan.orphan_photo ? percentCompleted : prevProgress.orphan_photo,
                        death_certificate: formData.father.death_certificate ? percentCompleted : prevProgress.death_certificate
                    }));
                },
            });

            setSuccessMessage('تمت إضافة البيانات بنجاح!');
            setErrorMessage('');
            setUploadProgress({ orphan_photo: 0, death_certificate: 0 });

            setTimeout(() => {
                setCurrentStep(0);
                setSuccessMessage('');
                resetForm();
            }, 5000);

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle validation errors
                const errors = error.response.data.errors;
                const formattedErrors = Object.values(errors).flat().join('\n');
                setErrorMessage(formattedErrors);
            } else if (error.message === 'Network Error') {
                // Handle network errors
                setErrorMessage('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال.');
            } else {
                // Handle other unexpected errors
                setErrorMessage('حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };



    const resetForm = () => {
        setFormData({
            orphan: {
                orphan_id_number: '',
                orphan_first_name: '',
                orphan_fathers_name: '',
                orphan_grandfathers_name: '',
                orphan_last_name: '',
                orphan_full_name: '',
                orphan_birth_date: '',
                orphan_gender: '',
                health_status: '',
                disease_description: '',
                original_address: '',
                current_address: '',
                address_details: '',
                number_of_brothers: '',
                number_of_sisters: '',
                is_enrolled_in_memorization_center: '',
                orphan_photo: '',
            },
            guardian: {
                guardian_id_number: '',
                guardian_first_name: '',
                guardian_fathers_name: '',
                guardian_grandfathers_name: '',
                guardian_last_name: '',
                guardian_full_name: '',
                guardian_relationship: '',
                guardian_phone_number: '',
                alternative_phone_number: '',
            },
            father: {
                father_first_name: '',
                father_fathers_name: '',
                father_grandfathers_name: '',
                father_last_name: '',
                deceased_father_full_name: '',
                deceased_father_birth_date: '',
                death_date: '',
                death_cause: '',
                previous_father_job: '',
                death_certificate: '',
            },
            mother: {
                mother_first_name: '',
                mother_fathers_name: '',
                mother_grandfathers_name: '',
                mother_last_name: '',
                mother_full_name: '',
                mother_id_number: '',
                is_mother_deceased: '',
                mother_birth_date: '',
                mother_death_date: '',
                mother_status: '',
                mother_job: '',
            },
            approval: {
                data_approval_name: '',
                isChecked: false
            }
        });
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    useEffect(() => {
        document.title = "استبانة كفالة اليتيم";
        const incrementVisitorCount = async () => {
            try {
                const response = await axios.post('https://forms-api.saiid.org/api/increment-visitor-count');
            } catch (error) {
                console.error('Error incrementing visitor count:', error);
            }
        };

        incrementVisitorCount();
    }, []);

    return (
        <div
            className="min-h-screen bg-gray-100 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8"
            style={{ direction: 'rtl' }}
        >

            <div className="bg-white shadow-md rounded-xl max-w-2xl mx-auto p-4 px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-10" style={{ direction: 'rtl' }}>
                <Logo />

                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                <div className='text-center mt-8 mb-8 text-xl'>
                    لمتابعة أنشطة الجمعية ولمسات الخير المستمرة، يمكنكم زيارة موقعها الإلكتروني
                    <a href="https://saiid.org" className='text-blue-500 font-bold' target='_blank' rel="noopener noreferrer"> saiid.org </a>
                </div>
                {successMessage && <SuccessMessage message={successMessage} />}
                {errorMessage && <ErrorMessage message={errorMessage} />}

                <Alert type="warning">
                    <p className="font-bold">تنبيه:</p>
                    <p>التسجيل لا يعني ضمان الكفالة، يرجى التأكد من قراءة جميع المعلومات قبل تقديم الطلب.</p>
                    <p>التسجيل للأطفال دون 12 عام.</p>
                </Alert>

                <form onSubmit={handleSubmit}>
                    {currentStep === 0 && (
                        <OrphanForm
                            formData={formData.orphan}
                            handleChange={(e) => handleChange('orphan', e)}
                        />
                    )}
                    {currentStep === 1 && (
                        <FatherForm
                            formData={formData.father}
                            handleChange={(e) => handleChange('father', e)}
                        />
                    )}
                    {currentStep === 2 && (
                        <MotherForm
                            formData={formData.mother}
                            handleChange={(e) => handleChange('mother', e)}
                        />
                    )}
                    {currentStep === 3 && (
                        <GuardianForm
                            formData={formData.guardian}
                            handleChange={(e) => handleChange('guardian', e)}
                        />
                    )}
                    {currentStep === 4 && (
                        <ApprovalForm
                            formData={formData.approval}
                            handleChange={(e) => handleChange('approval', e)}
                        />
                    )}
                    {/* 
                    {uploadProgress.orphan_photo > 0 && (
                        <div className="mt-4">
                            <p>تقدم رفع صورة اليتيم: {uploadProgress.orphan_photo}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress.orphan_photo}%` }}></div>
                            </div>
                        </div>
                    )}

                    
                    {uploadProgress.death_certificate > 0 && (
                        <div className="mt-4">
                            <p>تقدم رفع شهادة الوفاة: {uploadProgress.death_certificate}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress.death_certificate}%` }}></div>
                            </div>
                        </div>
                    )} 
                    */}
                    <NavigationButtons
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        handlePrevious={handlePrevious}
                        handleNext={handleNext}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
}

export default Main;