import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import _ from "lodash";
import AidForm from "./aidsForm";
import ApprovalForm from "../orphan/approvalForm";
import ProgressBar from "../base/progressBar";
import NavigationButtons from "../base/navigationButtons";
import SuccessMessage from "../base/successMessage";
import ErrorMessage from "../base/errorMessage";
import Alert from "../base/alert";
import Logo from "../base/logo";

function Main() {
    const hasIncrementedRef = useRef(false);
    const sections = ["بيانات المساعدة", "التعهد"];
    const totalSteps = sections.length;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        aid: {
            id_number: "",
            name: "",
            birth_date: "",
            age: "",
            gender: "",
            marital_status: "",
            job: "",
            monthly_income: "",
            is_refugee: "",
            has_disability: "",
            disability_description: "",
            mobile_number: "",
            alternate_mobile_number: "",
            residence_location: "",
            accommodation_type: "",
            displacement_location: "",
            family_members_count: "",
            has_sick_children: "",
            sick_children_description: "",
            receives_aid_from_others: "",
            aid_type: "",
        },
        approval: {
            data_approval_name: "",
            isChecked: false,
        },
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (section, e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [name]: type === "checkbox" ? checked : value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.approval.isChecked) {
            alert("يجب الموافقة على التعهد.");
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
            const response = await axios.post(
                "https://forms-api.saiid.org/api/aids",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data);
            setSuccessMessage("تمت إضافة البيانات بنجاح!");
            setErrorMessage("");
            console.error(response);

            setTimeout(() => {
                setCurrentStep(0);
                setSuccessMessage("");
                resetForm();
            }, 5000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors;
                const formattedErrors = Object.values(errors).flat().join("\n");
                setErrorMessage(formattedErrors);
            } else {
                setErrorMessage("حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            aid: {
                id_number: "",
                name: "",
                birth_date: "",
                age: "",
                gender: "",
                marital_status: "",
                job: "",
                monthly_income: "",
                is_refugee: "",
                has_disability: "",
                disability_description: "",
                mobile_number: "",
                alternate_mobile_number: "",
                residence_location: "",
                accommodation_type: "",
                displacement_location: "",
                family_members_count: "",
                has_sick_children: "",
                sick_children_description: "",
                receives_aid_from_others: "",
                aid_type: "",
            },
            approval: {
                data_approval_name: "",
                isChecked: false,
            },
        });
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    useEffect(() => {
        document.title = "استبانة المساعدات";
        const incrementVisitorCount = async () => {
            if (hasIncrementedRef.current) return;
            hasIncrementedRef.current = true;

            try {
                const response = await axios.post('https://forms-api.saiid.org/api/increment-visitor-aids-count');
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
                    <p>يرجى التأكد من قراءة جميع المعلومات قبل تقديم الطلب.</p>
                </Alert>

                <form onSubmit={handleSubmit}>
                    {currentStep === 0 && (
                        <AidForm
                            formData={formData.aid}
                            handleChange={(e) => handleChange("aid", e)}
                        />
                    )}
                    {currentStep === 1 && (
                        <ApprovalForm
                            formData={formData.approval}
                            handleChange={(e) => handleChange("approval", e)}
                        />
                    )}
                    <NavigationButtons
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        handlePrevious={handlePrevious}
                        handleNext={() => setCurrentStep(currentStep + 1)}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
}

export default Main;
