import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import HomeLayout from '../../layouts/PrivateLayout';
import { toast } from 'react-toastify';

interface Member {
    _id: string;
    email: string;
}
interface Event {
    message: string;
    createdAt: string;
}
interface Project {
    _id: string;
    name: string;
    owner: string;
    description: string;
    tasks: Task[];
    startDate: string;
    endDate: string;
    createdDate: string;
    updatedDate: string;
}
interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: string;
    priority: string;
    dueDate: string;
    createdDate: string;
    updatedDate: string;
}
const ProjectDetails: React.FC = () => {
    const status = ['To Do', 'In Progress', 'Completed'];
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        assignedTo: '',
        status: 'To Do',
        priority: 'Low',
        dueDate: '',
    });
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${apiUrl}/projects/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const projectData = response.data.data;
                setProject(projectData.project);
                setTasks(projectData.tasks || []);  // Assuming tasks are part of the response
                setMembers(projectData.project.members || []);
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };
        fetchProject();
    }, [projectId, apiUrl]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/projects/${projectId}/tasks/create`, newTask, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response && response.data.status === 201) {
                toast.success(response.data.data.message);
                setTasks([...tasks, response.data.data.task]);
                setNewTask({ name: '', description: '', assignedTo: '', status: 'To Do', priority: 'Low', dueDate: '' });
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status);
    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div className="flex flex-col gap-4 p-4">
                {project && <h1 className="text-3xl">{project.name}</h1>}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Tasks</h2>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700">
                        Add Task
                    </button>
                </div>
                {/* Grid Layout: 3 columns for tasks, 1 for events */}
                <div className="grid grid-cols-4 gap-4">
                    {status.map((statusColumn) => (
                        <div key={statusColumn} className="p-4 bg-white rounded-lg shadow-md">
                            <h3 className="mb-2 text-xl font-bold">{statusColumn}</h3>
                            <ul className="flex flex-col gap-2">
                                {getTasksByStatus(statusColumn).map((task) => (
                                    <li key={task._id} className="flex justify-between p-2 border-b border-gray-300">
                                        <span>{task.title}</span>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Events Column */}
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <h3 className="mb-2 text-xl font-bold">Project Events</h3>
                        <ul className="flex flex-col gap-2">
                            {events.length > 0 ? (
                                events.map((event, index) => (
                                    <li key={index} className="p-2 border-b border-gray-300">
                                        {event.message} <br />
                                        <span className="text-xs text-gray-500">on {new Date(event.createdAt).toLocaleString()}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No events available.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="mb-4 text-xl font-bold">Add New Task</h2>
                            <form onSubmit={handleAddTask}>
                                <label htmlFor="name">
                                    Name
                                    <input
                                        type="text"
                                        value={newTask.name}
                                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                        placeholder="New task name"
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    />
                                </label>
                                <label htmlFor="description">
                                    Description
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="New task description"
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    />
                                </label>
                                <label htmlFor="assignedTo">
                                    Assigned To
                                    <select
                                        value={newTask.assignedTo}
                                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select a member</option>
                                        {members.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.email}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor="status">
                                    Status
                                    <select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    >
                                        {status.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor="priority">
                                    Priority
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </label>
                                <label htmlFor="dueDate">
                                    Due Date
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    />
                                </label>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </HomeLayout>
    );
};

export default ProjectDetails;

