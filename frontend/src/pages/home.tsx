// src/pages/HomePage.tsx
import React from 'react';
import HomeLayout from '../layouts/PrivateLayout';
import Sidebar from '../components/Sidebar';

const HomePage: React.FC = () => {
    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
                <p className="text-gray-600">Here you can manage your tasks, projects, and settings.</p>
                {/* Add more content or components here */}
            </div>
        </HomeLayout>
    );
};

export default HomePage;
