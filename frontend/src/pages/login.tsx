import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';
import axios from 'axios';
import useAuth from '../hooks/useAuth';


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    // const [error, setError] = useState<string>('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call backend API for authentication
        if (email === '' || password === '') {
            toast.error("Email and Password are required");
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
            if (response.data.status === 200) {
                login({ token: response.data.data.token });
                navigate('/home');
            } else {
                toast.error(response.data.data.message);
            }
        } catch (error) {
            toast.error("An error occurred during login." + error);
        }
    };

    return (
        <AuthLayout title="Login to Your Account">
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700" htmlFor="email">
                        Email <span className="ml-1 text-sm text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${email === '' ? 'border-red-500' : 'focus:ring-2 border-gray-300 focus:ring-indigo-400'} `}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700" htmlFor="password">
                        Password <span className="ml-1 text-sm text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${password === '' ? 'border-red-500' : 'focus:ring-2 border-gray-300 focus:ring-indigo-400'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <div className="flex items-center justify-between mb-6">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="text-indigo-600 form-checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="ml-2 text-gray-700">Remember Me</span>
                    </label>

                    <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                        Forgot Password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    Login
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Sign Up</Link></p>
            </div>
        </AuthLayout>
    );
};

export default Login;
