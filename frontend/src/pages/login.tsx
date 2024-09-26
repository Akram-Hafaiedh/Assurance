import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FaRegUser, FaLock } from "react-icons/fa6";


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
        // <AuthLayout title="Login to Your Account">
        //     <form onSubmit={handleLogin}>
        //         <div className="mb-4">
        //             <label className="block mb-2 font-bold text-gray-700" htmlFor="email">
        //                 Email <span className="ml-1 text-sm text-red-500">*</span>
        //             </label>
        //             <input
        //                 id="email"
        //                 type="email"
        //                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${email === '' ? 'border-red-500' : 'focus:ring-2 border-gray-300 focus:ring-indigo-400'} `}
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 placeholder="Enter your email"
        //             />
        //         </div>

        //         <div className="mb-4">
        //             <label className="block mb-2 font-bold text-gray-700" htmlFor="password">
        //                 Password <span className="ml-1 text-sm text-red-500">*</span>
        //             </label>
        //             <input
        //                 id="password"
        //                 type="password"
        //                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${password === '' ? 'border-red-500' : 'focus:ring-2 border-gray-300 focus:ring-indigo-400'}`}
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 placeholder="Enter your password"
        //             />
        //         </div>

        //         <div className="flex items-center justify-between mb-6">
        //             <label className="inline-flex items-center">
        //                 <input
        //                     type="checkbox"
        //                     className="text-indigo-600 form-checkbox"
        //                     checked={rememberMe}
        //                     onChange={(e) => setRememberMe(e.target.checked)}
        //                 />
        //                 <span className="ml-2 text-gray-700">Remember Me</span>
        //             </label>

        //             <a href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
        //                 Forgot Password?
        //             </a>
        //         </div>

        //         <button
        //             type="submit"
        //             className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
        //             Login
        //         </button>
        //     </form>

        //     <div className="mt-6 text-center">
        //         <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Sign Up</Link></p>
        //     </div>
        // </AuthLayout>

        <div className="flex h-screen">
            {/* Left Side - Login Form */}
            <div className="relative flex flex-col items-center justify-center w-1/2 px-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="mb-6 text-3xl font-semibold text-center text-gray-700">Welcome to</h2>
                    <div className="my-10">
                        <img
                            src="src/assets/images/logo-c.svg"
                            alt="Analytics"
                            className="mx-auto max-h-[130px]"
                        />
                    </div>
                    <p className="mb-2 font-bold text-center text-green-500">Log in to start your work.</p>
                    <div className="mb-4 text-sm text-center text-gray-400">This account is for personal use only—do not share your credent</div>

                    <form onSubmit={handleLogin}>
                        <div className="relative w-full mb-4">
                            <input
                                type="email"
                                placeholder="Username or e-mail"
                                className="w-full py-3 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="absolute inset-y-0 flex items-center pl-3 left-1">
                                <FaRegUser className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full py-3 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="absolute inset-y-0 flex items-center pl-3 left-1">
                                <FaLock className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <button type="submit"
                            className="w-full py-3 text-white transition duration-200 bg-blue-900 rounded-full mt-9 hover:bg-blue-800"
                        >
                            Login
                        </button>
                    </form>
                    <div className="flex items-center justify-between px-8 mt-8">
                        <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot your password?
                        </Link>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                <a href="#" className="text-green-500 hover:underline">
                                    Contact the admin
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="absolute left-0 right-0 mt-4 mr-4 text-sm text-center text-gray-400 bottom-10">2023 Casa Group. All rights reserved.</p>

            </div>

            {/* Right Side - Info */}
            <div className="flex items-center justify-center w-1/2 bg-center bg-no-repeat bg-cover"
                style={{
                    backgroundImage: "url('src/assets/images/login-bg.jpg')",
                }}>
                <div className="px-8 text-center text-white">
                    {/* Add some mockup image or relevant data */}
                    <div className="my-8">
                        <img
                            src="src/assets/images/logo-b.svg"
                            alt="Analytics"
                            className="mx-auto max-h-[375px]"
                        />
                    </div>
                    <p className="max-w-lg mb-4 text-sm">
                        This plateform is for <span className="font-bold">Casa Group</span> employees only, focused on enhancing their teamwork,
                        clear communication and efficient collaboration.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;
