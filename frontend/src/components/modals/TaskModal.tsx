// src/components/TaskModal.tsx

import React, { useState, useEffect } from 'react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTask: (task: Task) => void;
    onEditTask: (task: Task) => void;
    task: Task | null;
    members: Member[];
}


export interface Member {
    _id: string;
    email: string;
}
export interface Task {
    _id?: string; // Optional for new tasks
    title: string;
    description: string;
    assignedTo: string,
    status: string;
    priority: string;
    dueDate: string;
    createdDate?: string;
    updatedDate?: string;
}
const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onAddTask, onEditTask, task, members }) => {
    const [localTask, setLocalTask] = useState<Task | null>(task);

    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localTask) {
            if (task?._id) {
                onEditTask(localTask);
            } else {
                onAddTask(localTask);
            }
        }
    };


    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-bold">{task?._id ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">
                        Title
                        <input
                            type="text"
                            value={localTask?.title || ''}
                            onChange={(e) => setLocalTask({ ...localTask!, title: e.target.value })}
                            placeholder="Task title"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </label>
                    <label htmlFor="description">
                        Description
                        <textarea
                            value={localTask?.description || ''}
                            onChange={(e) => setLocalTask({ ...localTask!, description: e.target.value })}
                            placeholder="Task description"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </label>
                    <label htmlFor="assignedTo">
                        Assigned To
                        <select
                            value={localTask?.assignedTo._id || ''}
                            onChange={(e) => setLocalTask({ ...localTask!, assignedTo: e.target.value })}
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
                            value={localTask?.status || 'To Do'}
                            onChange={(e) => setLocalTask({ ...localTask!, status: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </label>
                    <label htmlFor="priority">
                        Priority
                        <select
                            value={localTask?.priority || 'Low'}
                            onChange={(e) => setLocalTask({ ...localTask!, priority: e.target.value })}
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
                            value={localTask?.dueDate || ''}
                            onChange={(e) => setLocalTask({ ...localTask!, dueDate: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        />
                    </label>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                        >
                            {task?._id ? 'Save Changes' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default TaskModal;
