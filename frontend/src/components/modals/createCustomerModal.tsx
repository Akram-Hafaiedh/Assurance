import { Switch } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

interface customerCreateProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCustomer: (customer: CustomerData) => void;
    onEditCustomer: (customer: CustomerData) => void;
    customer: CustomerData | null;
}

interface accounting {
    contractStartDate: Date;
    accountingDocuments: string[];
}

interface insurance {
    type: string;
    agency: string;
    insuranceNumber: string;
    startDate: Date;
    endDate: Date;
    cancellationPeriod: number;
    amountToPay: number;
    paymentFrequency: string;
}

interface tax {
    name: string;
    percentage: number;
    type: string;
    documents: string[];
}

interface CustomerData {
    _id?: string;
    firstName: string;
    lastName: string;
    companyName: string;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    postalCode: string;
    city: string;
    email: string;
    idOrPassport: string;
    accounting: accounting;
    insurances: insurance[];
    taxes: tax[];
}

const CustomerCreate: React.FC<customerCreateProps> = ({ isOpen, onClose, onAddCustomer, onEditCustomer, customer }) => {
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [enabled, setEnabled] = useState(false);
    const [localCustomer, setLocalCustomer] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [customerData, setCustomerData] = useState<CustomerData>({
        firstName: '',
        lastName: '',
        companyName: '',
        dateOfBirth: '',
        phoneNumber: '',
        address: '',
        postalCode: '',
        city: '',
        email: '',
        idOrPassport: '',
        accounting: {
            contractStartDate: new Date(),
            accountingDocuments: []
        },
        insurances: [
            {
                type: '',
                agency: '',
                insuranceNumber: '',
                startDate: new Date(),
                endDate: new Date(),
                cancellationPeriod: 0,
                amountToPay: 0,
                paymentFrequency: ''
            }
        ],
        taxes: [
            {
                name: '',
                percentage: 0,
                type: '',
                documents: []
            }
        ]
    });
    const insuranceTypes = [
        { value: "life", name: "Life Insurance" },
        { value: "health", name: "Health Insurance" },
        { value: "car", name: "Car Insurance" },
        { value: "house", name: "Household Insurance" },
        { value: "liability", name: "Private Liability Insurance" },
        { value: "sickness", name: "Daily Sickness Allowance Insurance" },
        { value: "pension", name: "Occupational Pension Insurance" },
        { value: "accident", name: "Accident Insurance" },
        { value: "professional", name: "Professional Liability Insurance" },
        { value: "property", name: "Property Insurance" },
        { value: "construction", name: "Construction Guarantee Insurance" },
    ]

    const paymentFrequencyOptions = [
        { value: "monthly", name: "Monthly" },
        { value: "quarterly", name: "Quarterly" },
        { value: "semi-annually", name: "Semi-Annually" },
        { value: "annually", name: "Annually" }
    ];

    const agencyOptions = [
        { value: "agenturen", name: "Agenturen" },
        { value: "mnbroker", name: "MN Broker" },
        { value: "markler", name: "Markler Zentrum" },
        { value: "helvetia", name: "Helvetia" }
    ];
    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);


    const addInsurance = () => {
        setCustomerData((prevData) => ({
            ...prevData,
            insurances: [
                ...prevData.insurances,
                {
                    type: '',
                    agency: '',
                    insuranceNumber: '',
                    startDate: new Date(),
                    endDate: new Date(),
                    cancellationPeriod: 0,
                    amountToPay: 0,
                    paymentFrequency: ''
                }
            ]
        }));
    };

    const removeInsurance = (index: number) => {
        setCustomerData((prevData) => ({
            ...prevData,
            insurances: prevData.insurances.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        setLocalCustomer(customer);
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     setCustomerData((prevData) => ({
    //         ...prevData,
    //         insurances: [
    //             {
    //                 ...prevData.insurances[0],
    //                 [name]: value
    //             }
    //         ]
    //     }));
    // }
    const handleInsuranceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerData((prevData) => {
            const updatedInsurances = [...prevData.insurances];
            updatedInsurances[index] = {
                ...updatedInsurances[index],
                [name]: value
            };
            return { ...prevData, insurances: updatedInsurances };
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(customerData);

        setError('');
        setLoading(true);
        setSuccess(false);

        if (!customerData.firstName) {
            setError('First name is required');
            return;
        }
        if (!customerData.lastName) {
            setError('Last name is required');
            return;
        }
        if (!customerData.dateOfBirth) {
            setError('Date of birth is required');
            return;
        }
        if (!customerData.phoneNumber) {
            setError('Phone number is required');
            return;
        }
        if (!customerData.address) {
            setError('Address is required');
            return;
        }
        if (!customerData.postalCode) {
            setError('Postal code is required');
            return;
        }
        if (!customerData.city) {
            setError('City is required');
            return;
        }
        if (!customerData.email) {
            setError('Email is required');
            return;
        }
        if (!customerData.idOrPassport) {
            setError('ID or passport is required');
            return;
        }
        if (!customerData.accounting.contractStartDate) {
            setError('Contract start date is required');
            return;
        }

        // if (localCustomer) {
        //     if (customer?._id) {
        //         onEditCustomer(localCustomer);
        //     } else {
        //         onAddCustomer(localCustomer);
        //     }
        // }

        // try {
        //     const newCustomer = { ...customerData };
        //     const response = await axiosInstance.post(`/customers/create`, newCustomer);
        //     console.log(response.data);
        //     if (response && response.data.status === 201) {
        //         navigate(`/customers/${response.data.data.customer._id}`);
        //     }
        // } catch (error) {
        //     console.error('Error creating customer:', error);
        //     setError('An error occurred while creating the customer.');
        // }
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 max-w-5xl max-h-[80vh] p-6 bg-white rounded-lg shadow-lg overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <h1 className="text-2xl font-bold">Create Customer</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    {/* {success && <p className="text-green-500">Customer created successfully!</p>} */}
                    {step === 1 && (
                        <>
                            <h2 className="text-lg font-semibold">Personal Information</h2>
                            <div className="flex items-center mb-4 space-x-2">
                                <span className="mr-3">Professional</span>
                                {/* <span className="mr-3">{enabled ? 'Professional' : 'Personal'}</span> */}
                                <Switch
                                    checked={enabled}
                                    onChange={setEnabled}
                                    className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
                                >
                                    <span className="sr-only">Toggle Mode</span>
                                    <span
                                        className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                                    />
                                </Switch>
                            </div>
                            {/* General Fields */}

                            <div className="grid grid-cols-2 gap-x-6">
                                {['companyName', 'firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'address', 'postalCode', 'city', 'email', 'idOrPassport'].map((field, index) => (
                                    <div key={index} className={`space-y-1 mb-4 ${field === 'companyName' ? 'col-span-2' : ''}`}>
                                        {field === 'companyName' && enabled && (
                                            <>
                                                <label htmlFor={field} className="block font-medium">
                                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                <input
                                                    type='text'
                                                    name={field}
                                                    value={customerData[field as keyof CustomerData] as string}
                                                    onChange={handleChange}
                                                    placeholder={field.replace(/([A-Z])/g, ' $1').trim()} // Converts camelCase to spaced string
                                                    required={field !== 'companyName'}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </>
                                        )}
                                        {field !== 'companyName' && (
                                            <>
                                                <label htmlFor={field} className="block font-medium">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}</label>
                                                <input
                                                    type={field === 'dateOfBirth' || field === 'contractStartDate' ? 'date' : 'text'}
                                                    name={field}
                                                    value={customerData[field as keyof CustomerData] as string}
                                                    onChange={handleChange}
                                                    placeholder={field.replace(/([A-Z])/g, ' $1').trim()} // Converts camelCase to spaced string
                                                    required={field !== 'companyName'}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* "Next" button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h2 className="text-lg font-semibold">Insurance Details</h2>
                            {customerData.insurances.map((insurance, index) => (
                                <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-x-6">
                                    <div className="inline-flex col-span-3 mb-4">
                                        <h3 className="text-semibol">Insurance {index + 1}</h3>
                                        <button type="button" onClick={() => removeInsurance(index)} className="col-span-1 text-red-500 ms-2">
                                            ( Remove )
                                        </button>
                                    </div>

                                    {['type', 'agency', 'insuranceNumber', 'startDate', 'endDate', 'cancellationPeriod', 'amountToPay', 'paymentFrequency'].map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="col-span-1 mb-4 space-y-1">
                                            <label htmlFor={`${field}-${index}`} className="block font-medium">
                                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                            {field === 'type' || field === 'agency' || field === 'paymentFrequency' || field === 'cancellationPeriod' ? (
                                                <>
                                                    {field === 'type' && (
                                                        <select
                                                            name={field}
                                                            value={insurance[field as keyof insurance] as string}
                                                            onChange={(e) => handleInsuranceChange(index, e)}
                                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Type</option>
                                                            {insuranceTypes.map((option, optionIndex) => (
                                                                <option key={optionIndex} value={option.value}>
                                                                    {option.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {field === 'agency' && (
                                                        <select
                                                            name={field}
                                                            value={insurance[field as keyof insurance] as string}
                                                            onChange={(e) => handleInsuranceChange(index, e)}
                                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Agency</option>
                                                            {agencyOptions.map((option, optionIndex) => (
                                                                <option key={optionIndex} value={option.value}>
                                                                    {option.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {field === 'paymentFrequency' && (
                                                        <select
                                                            name={field}
                                                            value={insurance[field as keyof insurance] as string}
                                                            onChange={(e) => handleInsuranceChange(index, e)}
                                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Payment Frequency</option>
                                                            {paymentFrequencyOptions.map((option, optionIndex) => (
                                                                <option key={optionIndex} value={option.value}>
                                                                    {option.name}
                                                                </option>
                                                            ))}

                                                        </select>
                                                    )}
                                                    {field === 'cancellationPeriod' && (
                                                        <select
                                                            name={field}
                                                            value={customerData.insurances[0][field as keyof insurance] as string}
                                                            onChange={(e) => handleInsuranceChange(index, e)}
                                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Cancellation Period</option>
                                                            {Array.from({ length: 12 }).map((_, i) => (
                                                                <option value={i + 1} key={i + 1}>
                                                                    Before {i + 1} Month{i + 1 === 1 ? '' : 's'}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </>
                                            ) : (
                                                <input
                                                    type={field.includes('Date') ? 'date' : 'text'}
                                                    name={field}
                                                    value={insurance[field as keyof insurance] as string}
                                                    onChange={(e) => handleInsuranceChange(index, e)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            )}
                                        </div>
                                    ))}


                                    {index < customerData.insurances.length - 1 && (
                                        <hr className="col-span-3 my-4 border-t border-gray-300 border-dashed w-100" />
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addInsurance}
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                            >
                                Add Insurance
                            </button>
                            {/* "Back" and "Submit" buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    )}

                    {/* <h2 className="text-lg font-semibold">Insurance Details</h2>
                    <div className="grid grid-cols-3 gap-x-6">
                        {['type', 'agency', 'insuranceNumber', 'startDate', 'endDate', 'cancellationPeriod', 'amountToPay', 'paymentFrequency'].map((field, index) => (
                            <div key={index} className="col-span-1 mb-4 space-y-1">
                                <label htmlFor={field} className="block font-medium">{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}</label>
                                {field === 'type' || field === 'agency' || field === 'paymentFrequency' || field === 'cancellationPeriod' ? (
                                    <>
                                        {field === 'type' && (
                                            <>
                                                <select
                                                    name={field}
                                                    value={customerData.insurances[0][field as keyof insurance] as string}
                                                    onChange={handleSelectChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="life">Life Insurance</option>
                                                    <option value="health">Health Insurance</option>
                                                    <option value="car">Car Insurance</option>
                                                    <option value="house">Household Insurance</option>
                                                    <option value="liability">Private Liability Insurance</option>
                                                    <option value="sickness">Daily Sickness Allowance Insurance</option>
                                                    <option value="pension">Occupational Pension Insurance</option>
                                                    <option value="accident">Accident Insurance</option>
                                                    <option value="professional">Professional Liability Insurance</option>
                                                    <option value="property">Property Insurance</option>
                                                    <option value="construction">Construction Guarantee Insurance</option>
                                                </select>
                                            </>
                                        )}
                                        {field === 'agency' && (
                                            <>
                                                <select
                                                    name={field}
                                                    value={customerData.insurances[0][field as keyof insurance] as string}
                                                    onChange={(e) => handleSelectChange(e)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Agency</option>
                                                    <option value="agenturen">Agenturen</option>
                                                    <option value="mnbroker">MN Broker</option>
                                                    <option value="markler">Markler Zentrum</option>
                                                    <option value="helvetia">Helvetia</option>
                                                </select>
                                            </>
                                        )}
                                        {field === 'paymentFrequency' && (
                                            <>
                                                <select
                                                    name={field}
                                                    value={customerData.insurances[0][field as keyof insurance] as string}
                                                    onChange={(e) => handleSelectChange(e)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Payment Frequency</option>
                                                    <option value="monthly">Monthly</option>
                                                    <option value="quarterly">Quarterly</option>
                                                    <option value="semi-annually">Semi-Annually</option>
                                                    <option value="annually">Annually</option>
                                                </select>
                                            </>
                                        )}
                                        {field === 'cancellationPeriod' && (
                                            <>
                                                <select
                                                    name={field}
                                                    value={customerData.insurances[0][field as keyof insurance] as string}
                                                    onChange={(e) => handleSelectChange(e)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Cancellation Period</option>
                                                    {Array.from({ length: 12 }).map((_, i) => (
                                                        <option value={i + 1} key={i + 1}>
                                                            Before {i + 1} Month{i + 1 === 1 ? '' : 's'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <input
                                        type={field.includes('Date') ? 'date' : field.includes('amount') || field.includes('cancellation') ? 'number' : 'text'}
                                        name={field}
                                        value={customerData.insurances[0][field as keyof insurance] as string}
                                        onChange={handleChange}
                                        placeholder={field.replace(/([A-Z])/g, ' $1').trim()} // Converts camelCase to spaced string
                                        required={true}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div> */}
                </form>
            </div>
        </div>
    ) : null;
};

export default CustomerCreate;