import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Avatar from 'react-avatar';

interface PrivateLayoutProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ sidebar, children }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        // Clear authentication state
        logout();
        toast.success("You have been logged out.");
        navigate('/');
    };
    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="flex flex-col w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <nav className="mt-4">
                        {sidebar}
                    </nav>
                </div>

                <div className="p-6 mt-auto">
                    {user && (<div className="flex items-center mb-4">
                        <Avatar name={user.email} size="40" round={true} />
                        <span className="ml-2 text-sm font-medium">{user.email}</span>
                    </div>
                    )}
                    <hr className="my-4 border-t border-gray-200" />

                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Disconnect
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
};

export default PrivateLayout;
