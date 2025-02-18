import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ShelterForm from './shelterForm';
import ManagerForm from './managerForm';
import DeputyManagerForm from './deputyManagerForm';
import ApprovalForm from '../orphan/approvalForm'; // Reusing the approval form
import ProgressBar from '../base/progressBar';
import NavigationButtons from '../base/navigationButtons';
import SuccessMessage from '../base/successMessage';
import ErrorMessage from '../base/errorMessage';
import Alert from '../base/alert';
import Logo from '../base/logo';
// import { ExternalLink, FileSpreadsheet } from 'lucide-react';

function Main() {
    const sections = ['بيانات مركز نزوح', 'بيانات المدير', 'بيانات نائب المدير', 'التعهد'];
    const hasIncrementedRef = useRef(false);
    const totalSteps = sections.length;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        shelter: {
            camp_name: '',
            governorate: '',
            district: '',
            detailed_address: '',
            tents_count: '',
            families_count: '',
            excel_sheet: null
        },
        manager: {
            manager_id_number: '',
            manager_name: '',
            manager_phone: '',
            manager_alternative_phone: '',
            manager_job_description: '',
        },
        deputy: {
            deputy_manager_name: '',
            deputy_manager_id_number: '',
            deputy_manager_phone: '',
            deputy_manager_alternative_phone: '',
            deputy_manager_job_description: '',
        },
        approval: {
            data_approval_name: '',
            isChecked: false
        }
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (section, e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.shelter.excel_sheet) {
            setErrorMessage('يرجى تحميل ملف Excel للنازحين');
            return;
        }

        if (!formData.approval.isChecked) {
            alert('يجب الموافقة على التعهد.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData object for shelter data
            const formDataToSend = new FormData();

            // Add shelter data
            formDataToSend.append('camp_name', formData.shelter.camp_name);
            formDataToSend.append('governorate', formData.shelter.governorate);
            formDataToSend.append('district', formData.shelter.district);
            formDataToSend.append('detailed_address', formData.shelter.detailed_address);
            formDataToSend.append('tents_count', formData.shelter.tents_count);
            formDataToSend.append('families_count', formData.shelter.families_count);
            formDataToSend.append('excel_sheet', formData.shelter.excel_sheet);

            // Add manager data
            formDataToSend.append('manager_id_number', formData.manager.manager_id_number);
            formDataToSend.append('manager_name', formData.manager.manager_name);
            formDataToSend.append('manager_phone', formData.manager.manager_phone);
            formDataToSend.append('manager_alternative_phone', formData.manager.manager_alternative_phone || '');
            formDataToSend.append('manager_job_description', formData.manager.manager_job_description);

            // Add deputy manager data
            formDataToSend.append('deputy_manager_name', formData.deputy.deputy_manager_name);
            formDataToSend.append('deputy_manager_id_number', formData.deputy.deputy_manager_id_number);
            formDataToSend.append('deputy_manager_phone', formData.deputy.deputy_manager_phone);
            formDataToSend.append('deputy_manager_alternative_phone', formData.deputy.deputy_manager_alternative_phone || '');
            formDataToSend.append('deputy_manager_job_description', formData.deputy.deputy_manager_job_description);

            // First store shelter data
            const response = await axios.post('https://forms-api.saiid.org/api/shelters', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });


            // Create separate FormData for Excel file
            const excelFormData = new FormData();
            excelFormData.append('file', formData.shelter.excel_sheet); // Changed from 'excel_sheet' to 'file'
            excelFormData.append('manager_id_number', formData.manager.manager_id_number);

            // Process Excel file
            // await axios.post('http://127.0.0.1:8000/api/refugees/import', excelFormData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // })
            //     .then(response => {
            //         console.log('Success:', response.data);
            //         console.log('Imported Rows:', response.data.imported_rows);
            //     })
            //     .catch(error => {
            //         console.error('Error:', error.response ? error.response.data : error.message);
            //         console.log('Imported Rows:', response.data.imported_rows);

            //     });

            setSuccessMessage('تم تسجيل بيانات مركز نزوح ومعالجة ملف Excel بنجاح!');
            setErrorMessage('');

            // Reset form after successful submission
            setTimeout(() => {
                setCurrentStep(0);
                setSuccessMessage('');
                resetForm();
            }, 5000);

        } catch (error) {
            console.error('Submission error:', error);
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const formattedErrors = Object.values(errors).flat().join('\n');
                setErrorMessage(formattedErrors);
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.message === 'Network Error') {
                setErrorMessage('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال.');
            } else {
                setErrorMessage('حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            shelter: {
                camp_name: '',
                governorate: '',
                district: '',
                detailed_address: '',
                tents_count: '',
                families_count: '',
                excel_sheet: null,
            },
            manager: {
                manager_id_number: '',
                manager_name: '',
                manager_phone: '',
                manager_alternative_phone: '',
                manager_job_description: '',
            },
            deputy: {
                deputy_manager_name: '',
                deputy_manager_id_number: '',
                deputy_manager_phone: '',
                deputy_manager_alternative_phone: '',
                deputy_manager_job_description: '',
            },
            approval: {
                data_approval_name: '',
                isChecked: false
            }
        });
    };

    const handleNext = () => {
        if (currentStep < sections.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    useEffect(() => {
        document.title = "استبانة المركز نزوح";
        const incrementVisitorCount = async () => {
            if (hasIncrementedRef.current) return;
            hasIncrementedRef.current = true;
            try {
                const response = await axios.post('https://forms-api.saiid.org/api/increment-visitor-shelters-count');
                console.log(response.data);
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
            <div className="bg-white shadow-md rounded-xl max-w-2xl mx-auto p-4 px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-10">
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
                    <p>يرجى التأكد من صحة جميع البيانات المدخلة قبل إرسال النموذج.</p>

                </Alert>

                <form onSubmit={handleSubmit}>
                    {currentStep === 0 && (
                        <ShelterForm
                            formData={formData.shelter}
                            handleChange={(e) => handleChange('shelter', e)}
                        />
                    )}
                    {currentStep === 1 && (
                        <ManagerForm
                            formData={formData.manager}
                            handleChange={(e) => handleChange('manager', e)}
                        />
                    )}
                    {currentStep === 2 && (
                        <DeputyManagerForm
                            formData={formData.deputy}
                            handleChange={(e) => handleChange('deputy', e)}
                        />
                    )}
                    {currentStep === 3 && (
                        <ApprovalForm
                            formData={formData.approval}
                            handleChange={(e) => handleChange('approval', e)}
                        />
                    )}

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
