import axios from "axios";
import { useEffect, useState } from "react";
import HomeLayout from '../layouts/PrivateLayout';
import Sidebar from '../components/Sidebar';
interface User {
    _id: string;
    email: string;
    role: { name: string }
}
const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setUsers(response.data.data.users);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching users', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    if (loading) return <p>Loading...</p>;
    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="mb-4 text-2xl font-bold">Users List</h1>
                    <button className="px-4 py-2 text-white bg-blue-500 rounded">Add User</button>
                </div>
                <table className="min-w-full bg-white table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 && users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">{user.role.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </HomeLayout>

    );
};

export default Users;