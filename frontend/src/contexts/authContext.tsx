import { createContext, useEffect, useState } from "react";
import useAxiosInstance from "../utils/axiosInstance";
import axios from "axios";
interface User {
    email: string;
    role: string;
}
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: ({ token }: { token: string }) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                setIsAuthenticated(true);
                setUser(JSON.parse(storedUser));
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async ({ token }: { token: string }) => {
        console.log('login', token);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        try {
            // const response = await axios.get('/users/me');
            const response = await axios.get(`${apiUrl}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response && response.data.status === 200) {
                const { email, role } = response.data.data.user;
                localStorage.setItem('user', JSON.stringify({ email, role: role.name }));
                setUser({ email, role: role.name });
            }

        } catch (error) {
            console.log('Error fetching user', error);
            logout();
        }
    }
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token'); // Remove token from local storage
        localStorage.removeItem('user');
    }

    if (loading) {
        return <div className="text-center spinner">Loading...</div>; // You can also show a spinner here
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthContext };