import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'; // Make sure to install @heroicons/react

interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: { _id: string; email: string }; // Assuming assignedTo has these fields
    status: string;
    priority: string;
    dueDate: string;
}

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
    return (
        <div className="relative flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <Menu as="div" className="relative">
                    <MenuButton className="p-2 text-gray-500 hover:text-gray-700">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-36">
                        <div className="py-1">
                            <MenuItem>
                                {() => (
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="block px-4 py-2 text-sm bg-gray-100'text-gray-700' hover:bg-gray-200 w-full text-start"
                                    >
                                        Edit
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {() => (
                                    <button
                                        onClick={() => onDelete(task._id)}
                                        className="block px-4 py-2 text-sm bg-gray-100'text-gray-700' hover:bg-gray-200 w-full text-start"
                                    >
                                        Delete
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>
            </div>
            <p className="mt-2 text-sm text-gray-600">{task.description}</p>
            <div className="mt-2 text-xs text-gray-500">
                Assigned To: {task.assignedTo.email} <br />
                Priority: {task.priority} <br />
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
            </div>
        </div>
    );
};

export default TaskCard;
