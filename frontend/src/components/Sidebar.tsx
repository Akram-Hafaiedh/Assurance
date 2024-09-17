// src/Sidebar.tsx
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
const Sidebar: React.FC = () => {
    const { user } = useAuth();
    return (
        <div>
            <ul>
                <li>
                    <Link to="/home" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-200">Home</Link>
                </li>
                {user?.role === 'admin' && (
                    <li>
                        <Link to="/users" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-200">Users</Link>
                    </li>
                )}

                <li>
                    <Link to="/tasks" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-200">Tasks</Link>
                </li>
                <li>
                    <Link to="/projects" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-200">Projects</Link>
                </li>
                <li>
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-200">Settings</Link>
                </li>

            </ul>
        </div>
    );
};

export default Sidebar;