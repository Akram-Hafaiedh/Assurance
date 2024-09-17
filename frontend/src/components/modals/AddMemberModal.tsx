import axios from "axios";
import { useEffect, useState } from "react";
import Select, { MultiValue } from 'react-select';

interface User {
    _id: string;
    email: string;
}
interface SelectOption {
    value: string;
    label: string;
    isDisabled?: boolean;
}

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMembers: (selectedUsers: User[]) => void;
    selectedUsers: User[];  // Add this prop
}
const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAddMembers, selectedUsers }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [localSelectedUsers, setLocalSelectedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    useEffect(() => {
        setLocalSelectedUsers(selectedUsers);
    }, [selectedUsers]);

    const userOptions: SelectOption[] = users.map((user) => {
        const isDisabled = localSelectedUsers.some(selectedUser => selectedUser._id === user._id);
        const isSelected = localSelectedUsers.some(selectedUser => selectedUser._id === user._id);
        return {
            value: user._id,
            label: `${user.email}`,
            isDisabled: isDisabled,
            isSelected: isSelected,
        }
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${apiUrl}/users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response && response.data.status === 200) {
                    setUsers(response.data.data.users)
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen, apiUrl]);

    const handleSelectChange = (selectedOptions: MultiValue<SelectOption>) => {
        const newSelectedUsers = selectedOptions.map((option) => {
            return { _id: option.value, email: option.label };
        });
        setLocalSelectedUsers(newSelectedUsers);
    };

    const handleAddMembers = () => {
        onAddMembers(selectedUsers);
        onClose(); // Close the modal after adding
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-lg font-bold">Add Members</h2>
                {isLoading ? (
                    <p className="text-center">Loading users...</p>
                ) : (
                    <Select
                        isMulti
                        options={userOptions}
                        value={localSelectedUsers.map(user => ({
                            value: user._id,
                            label: user.email,
                        }))}
                        onChange={handleSelectChange}
                        isSearchable
                        placeholder="Search and select users..."
                        className="w-full mt-4"
                    />
                )}

                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        onClick={handleAddMembers}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Add Members
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddMemberModal;
