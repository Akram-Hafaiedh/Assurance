import Sidebar from "../../components/Sidebar";
import HomeLayout from "../../layouts/PrivateLayout";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import useAxiosInstance from "../../hooks/useAxiosInstance";
import CreateCustomerModal from "../../components/modals/createCustomerModal";
import { toast } from "react-toastify";

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
const CustomerListing: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customerToEdit, setCustomerToEdit] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
    // const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Items per page (limit)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const axiosInstance = useAxiosInstance();

    const fetchCustomers = useCallback(async (page: number, limit: number, search: string) => {
        try {
            const response = await axiosInstance.get('/customers', {
                params: { page, limit, search }
            });
            setCustomers(response.data.data.customers);
            setFilteredCustomers(response.data.data.customers);
            setTotalPages(response.data.data.totalPages);
            setCurrentPage(response.data.data.currentPage);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [axiosInstance]);

    useEffect(() => {
        fetchCustomers(currentPage, itemsPerPage, searchQuery);
    }, [currentPage, itemsPerPage, searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchCustomers(page, itemsPerPage, searchQuery);
    };

    const handleEditCustomer = async (customer: CustomerData) => {
        const response = await axiosInstance.put(`/customers/${customer._id}`, customer);
        if (response && response.data.status === 200) {
            toast.success(response.data.data.message);
            setFilteredCustomers(filteredCustomers.map(c => c._id === customer._id ? response.data.data.customer : c));
            // setCustomers([...customers, response.data.data.customer]);
            setCustomerToEdit(null);
            setIsModalOpen(false);
        }
    };
    const handleAddCustomer = async (customer: CustomerData) => {

        const response = await axiosInstance.post('/customers', customer);
        if (response && response.data.status === 201) {
            toast.success(response.data.data.message);
            // setCustomers([...customers, response.data.data.customer]);
            setFilteredCustomers(filteredCustomers.map(c => c._id === customer._id ? response.data.data.customer : c));
            setIsModalOpen(false);
        }
    };


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchCustomers(currentPage, itemsPerPage, query);
    };
    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="mb-4 text-2xl font-bold">Customers</h1>
                    <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">Create New Project</button>

                </div>
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                {/* Table */}
                <table className="w-full min-h-screen-minus-14rem">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-4 py-2 text-sm text-gray-600 border">ID</th>
                            <th className="px-4 py-2 text-sm text-gray-600 border">Full Name</th>
                            <th className="px-4 py-2 text-sm text-gray-600 border">Email</th>
                            <th className="px-4 py-2 text-sm text-gray-600 border">ID or Passport</th>
                            <th className="px-4 py-2 text-sm text-gray-600 border">Phone</th>
                            <th className="px-4 py-2 text-sm text-gray-600 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredCustomers?.length > 0 && filteredCustomers.map((customer) => (
                            <tr key={customer._id}>
                                <td className="px-4 py-2 text-sm text-gray-800 border">{customer._id}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 border">{customer.firstName} {customer.lastName}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 border">{customer.email}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 border">{customer.idOrPassport}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 border">{customer.phone}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 border">
                                    <Link to={`/customers/${customer._id}`} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">View</Link>
                                </td>
                            </tr>
                        ))}

                        {/* Empty state */}
                        {filteredCustomers?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-2 text-sm text-center text-gray-800 border">No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex flex-row-reverse items-center justify-between">


                    <div className="flex items-center justify-between mt-6 space-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>

                    {/* Optional: Page size selector */}
                    <div>
                        <label>
                            Items per page:
                            <select
                                className="p-2 ml-4 border border-gray-300 rounded-md"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* Modal */}

                <CreateCustomerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddCustomer={(customer) => handleAddCustomer(customer)}
                    onEditCustomer={(customer) => handleEditCustomer(customer)}
                    customer={customerToEdit}
                />

            </div>
        </HomeLayout>

    );
};

export default CustomerListing;
