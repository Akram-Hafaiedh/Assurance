import axios from "axios";
import { createContext, useEffect, useState } from "react";
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
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

    }, [])

    const login = async ({ token }: { token: string }) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        try {
            const response = await axios.get(`${apiUrl}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const { email, role } = response.data.data.user;
            localStorage.setItem('user', JSON.stringify({ email, role: role.name }));
            setUser({ email, role: role.name });

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

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthContext };