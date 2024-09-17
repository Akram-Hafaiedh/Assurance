// src/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';
import axios from 'axios';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email === '' || password === '' || confirmPassword === '') {
            toast.error("Passwords do not match");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/auth/register`, { email, password, confirmPassword });
            if (response.data.status === 201) {
                toast.success(response.data.data.message);
                navigate('/');
            } else {
                toast.error(response.data.data.message);
            }
        } catch (error) {
            toast.error("An error occurred during login." + error);
        }
    };

    return (
        <AuthLayout title="Create an Account">
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700" htmlFor="email">
                        Email <span className="ml-1 text-sm text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${email === '' ? 'border-red-500' : 'focus:ring-2 border-gray-300 focus:ring-indigo-400'}`}
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

                <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700" htmlFor="confirmPassword">
                        Confirm Password <span className="ml-1 text-sm text-red-500">*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${confirmPassword === '' || password !== confirmPassword ? 'border-red-500' : 'focus:ring-2 border-gray-300 focus:ring-indigo-400'}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    Register
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Already have an account? <Link to="/" className="text-indigo-600 hover:underline">Login</Link></p>
            </div>
        </AuthLayout>
    );
};

export default Register;
