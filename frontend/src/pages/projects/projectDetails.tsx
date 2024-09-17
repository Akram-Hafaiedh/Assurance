import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';  // Import SweetAlert2
import Sidebar from '../../components/Sidebar';
import HomeLayout from '../../layouts/PrivateLayout';
import { toast } from 'react-toastify';
import useAxiosInstance from '../../hooks/useAxiosInstance';
import TaskModal from '../../components/modals/TaskModal';
import TaskCard from '../../components/TaskCard';

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
    _id?: string;
    title: string;
    description: string;
    assignedTo: { _id: string; email: string; };
    status: string;
    priority: string;
    dueDate: string;
    createdDate?: string;
    updatedDate?: string;
}
const ProjectDetails: React.FC = () => {
    const axiosInstance = useAxiosInstance();
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
    const [members, setMembers] = useState<Member[]>([]);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const fetchEvents = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/projects/${projectId}/events`);
            const eventsData = response.data.data.events;
            setEvents(eventsData || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, [axiosInstance, projectId]);

    const fetchProject = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/projects/${projectId}`);
            const projectData = response.data.data;
            setProject(projectData.project);
            setTasks(projectData.tasks || []);  // Assuming tasks are part of the response
            setMembers(projectData.project.members || []);
            setEvents(projectData.events || []);
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    }, [axiosInstance, projectId]);

    useEffect(() => {
        fetchProject();
    }, []);



    const handleAddTask = async (task: Task) => {
        try {
            const response = await axiosInstance.post(`/projects/${projectId}/tasks/create`, task);
            if (response && response.data.status === 201) {
                toast.success(response.data.data.message);
                setTasks([...tasks, response.data.data.task]);
                setIsModalOpen(false);
                await fetchEvents();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };


    const handleEditTask = async (task: Task) => {
        try {
            const response = await axiosInstance.put(`/projects/${projectId}/tasks/${task._id}`, task);
            if (response && response.data.status === 200) {
                toast.success(response.data.data.message);
                setTasks(tasks.map(t => t._id === task._id ? response.data.data.task : t));
                setIsModalOpen(false);
                setTaskToEdit(null);
                await fetchEvents();
            }
        } catch (error) {
            console.error('Error editing task:', error);
        }
    }
    const handleDeleteTask = async (taskId: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this task!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                container: 'font-base',
                confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
                cancelButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded',
                title: 'text-xxl font-semibold mb-2',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);
                    if (response && response.data.status === 200) {
                        toast.success(response.data.data.message);
                        setTasks(tasks.filter(task => task._id !== taskId));
                        await fetchEvents(); 
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                }
            }
        });
    }


    const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status);
    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div className="flex flex-col gap-4 min-h-screen-minus-6rem">
                <div className="flex items-center justify-between">
                    {project && <h2 className="text-2xl">{project.name} Tasks</h2>}
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700">
                        Add Task
                    </button>
                </div>
                {/* Grid Layout: 3 columns for tasks, 1 for events */}
                <div className="grid flex-grow grid-cols-4 gap-4">
                    {['To Do', 'In Progress', 'Completed'].map((statusColumn) => (
                        <div key={statusColumn} className="h-full p-4 bg-white rounded-lg shadow-md">
                            <h3 className="mb-2 text-xl font-bold">{statusColumn}</h3>
                            <ul className="flex flex-col gap-2">
                                {getTasksByStatus(statusColumn).length > 0 ? (
                                    getTasksByStatus(statusColumn).map(task => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onEdit={(task) => {
                                                setTaskToEdit(task);
                                                setIsModalOpen(true);
                                            }}
                                            onDelete={handleDeleteTask}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No tasks in this status.</p>
                                )}
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
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    task={taskToEdit}
                    members={members}
                />
            </div>
        </HomeLayout>
    );

};

export default ProjectDetails;

