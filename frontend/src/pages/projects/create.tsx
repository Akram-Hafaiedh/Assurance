import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import HomeLayout from '../../layouts/PrivateLayout';



const ProjectCreate: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleCreate = async (e: React.FormEvent) => {
        setError('');
        e.preventDefault();
        if (!name) {
            setError('Project name is required');
            return;
        }
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            const newProject = { name, description, startDate, endDate, isPrivate };
            const response = await axios.post(`${apiUrl}/projects/create`, newProject, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data);
            if (response && response.data.status === 201) {
                navigate(`/projects/${response.data.data.project._id}`);
            }
        } catch (error) {
            console.error('Error creating project:', error);
            setError('An error occurred while creating the project.');
        }
    };

    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div className="container p-4 mx-auto">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-bold">Project Name</label>
                        <h1 className="mb-4 text-2xl font-bold">Create New Project</h1>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-bold">Description</label>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-bold">Start Date</label>
                        <input
                            type="date"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-bold">End Date</label>
                        <input
                            type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                        <label className="ml-2 text-sm">Private Project</label>
                    </div>
                    <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700">Create Project</button>

                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </HomeLayout>
    );
};

export default ProjectCreate;

