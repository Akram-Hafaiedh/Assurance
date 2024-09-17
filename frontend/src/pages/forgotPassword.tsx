import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [emailSent, setEmailSent] = useState<boolean>(false);

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (email === '') {
            toast.error("Please enter your email address.");
            return;
        }

        // Simulate sending reset instructions
        setEmailSent(true);
        toast.success("Password reset instructions sent to your email.");
    };

    return (
        <AuthLayout title="Forgot Your Password?">
            {emailSent ? (
                <div className="p-4 text-green-700 bg-green-100 rounded-lg">
                    <p>If the email exists in our system, you will receive password reset instructions shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleForgotPassword}>
                    <div className="mb-4">
                        <label className="flex items-center mb-2 font-bold text-gray-700">
                            Email <span className="ml-1 text-sm text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${email === '' ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-400`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        Send Reset Instructions
                    </button>
                </form>
            )}

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <a href="/" className="text-indigo-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
