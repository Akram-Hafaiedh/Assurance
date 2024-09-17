import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import HomeLayout from '../../layouts/PrivateLayout';
import { Switch } from '@headlessui/react';
import AddMemberModal from '../../components/modals/AddMemberModal';



interface Member {
    _id: string;
    email: string;
}
interface Task {
    _id: string;
    name: string;
    description: string;
    assignedTo: string;
    status: string;
    priority: string;
    dueDate: string;
    createdDate: string;
    updatedDate: string;
}
interface Project {
    _id: string;
    name: string;
    owner: string;
    members: Member[];
    description: string;
    tasks: Task[];
    startDate: string;
    endDate: string;
    isPrivate: boolean;
    createdDate: string;
    updatedDate: string;
}
const ProjectListing: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
    const [currentProjectMembers, setCurrentProjectMembers] = useState<Member[]>([]);
    const [tempTitle, setTempTitle] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [editingMemberProjectId, setEditingMemberProjectId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Items per page (limit)
    const [totalPages, setTotalPages] = useState<number>(1);

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const fetchProjects = useCallback(async (page: number, limit: number, search: string) => {
        try {
            const response = await axios.get(`${apiUrl}/projects`, {
                params: {
                    page,
                    limit,
                    search,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProjects(response.data.data.projects);
            setFilteredProjects(response.data.data.projects);
            setTotalPages(response.data.data.totalPages);
            setCurrentPage(response.data.data.currentPage);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchProjects(currentPage, itemsPerPage, searchQuery);
    }, [currentPage, itemsPerPage, searchQuery, fetchProjects]);

    const togglePrivacy = async (projectId: string, currentPrivacy: boolean) => {
        try {
            const response = await axios.put(`${apiUrl}/projects/${projectId}`, { isPrivate: !currentPrivacy }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response && response.data.status === 200) {
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project._id === projectId ? { ...project, isPrivate: !currentPrivacy } : project
                    )
                );
            }
        } catch (error) {
            console.error('Error updating project privacy:', error);
        }
    };

    const getInitials = (name: string) => {
        const words = name.split(' ');
        let initials = '';
        for (let i = 0; i < words.length; i++) {
            initials += words[i][0];
        }
        return initials.toUpperCase();
    }
    const handleAddMemberClick = (projectId: string) => {
        setEditingMemberProjectId(projectId);
        setCurrentProjectMembers(projects.find(project => project._id === projectId)?.members || []);
        setIsAddMemberModalOpen(true);
    };


    const handleTitleClick = (projectId: string, currentTitle: string) => {
        setEditingProjectId(projectId); // Set the project ID in editing mode
        setTempTitle(currentTitle); // Store the current title temporarily
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempTitle(event.target.value); // Update temporary title as user types
    };

    const handleTitleBlur = async (projectId: string) => {
        await saveProjectTitle(projectId);
    };

    const handleTitleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
        if (event.key === 'Enter') {
            await saveProjectTitle(projectId);
        }
    };

    const saveProjectTitle = async (projectId: string) => {
        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
            await axios.put(
                `${apiUrl}/projects/${projectId}`,
                { name: tempTitle },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            // Update local project title after saving
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === projectId ? { ...project, name: tempTitle } : project
                )
            );
            setEditingProjectId(null); // Exit editing mode after saving
        } catch (error) {
            console.error('Error saving project title:', error);
        }
    };

    const handleRemoveMember = async (memberId: string, projectId: string) => {
        try {
            const projectToUpdate = projects.find(project => project._id === projectId);
            if (!projectToUpdate) return;

            const updatedMembers = projectToUpdate.members.filter(member => member._id !== memberId);
            const response = await axios.put(`${apiUrl}/projects/${projectId}`, { members: updatedMembers }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response && response.data.status === 200) {
                // Update the local state with the new list of members
                setProjects(prevProjects =>
                    prevProjects.map(project =>
                        project._id === projectId ? { ...project, members: updatedMembers } : project
                    )
                );
            }
        } catch (error) {
            console.error('Error removing member from project:', error);
        }
    }

    const handleAddMembers = async (selectedUsers: Member[]) => {
        if (!editingMemberProjectId) return;
        try {
            const memberIds = selectedUsers.map(user => user._id);
            console.log(memberIds);

            const response = await axios.put(`${apiUrl}/projects/${editingMemberProjectId}`, { members: memberIds }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            console.log(response);
            if (response && response.data.status === 200) {
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project._id === editingMemberProjectId ? { ...project, members: selectedUsers } : project
                    )
                );
            }
        } catch (error) {
            console.error('Error adding members to project:', error);
        } finally {
            setEditingMemberProjectId(null);
        }
    }
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchProjects(page, itemsPerPage, searchQuery);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchProjects(currentPage, itemsPerPage, query);
    };

    return (
        <HomeLayout sidebar={<Sidebar />}>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="mb-4 text-2xl font-bold">Projects</h1>
                    <Link to="/projects/create" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">Create New Project</Link>

                </div>
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>

                {filteredProjects && filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project: Project) => (
                            <div key={project._id} className="p-4 bg-white rounded-lg shadow-md">

                                {editingProjectId === project._id ? (
                                    <input
                                        type="text"
                                        value={tempTitle}
                                        onChange={handleTitleChange}
                                        onBlur={() => handleTitleBlur(project._id)}
                                        onKeyDown={(event) => handleTitleKeyDown(event, project._id)}
                                        className="mb-2 text-lg font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
                                        autoFocus
                                    />
                                ) : (

                                    <h2 className="mb-2 text-lg font-bold"
                                        onClick={() => handleTitleClick(project._id, project.name)}>
                                        {project.name}
                                    </h2>
                                )}

                                <p className="mb-2 text-gray-700">{project.description}</p>

                                {/* Members as overlapping circles */}
                                <div className="flex items-center mb-4 -space-x-2">
                                    {project.members.slice(0, 4).map((member, index) => (
                                        <div
                                            key={index}
                                            className="relative z-10 flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-blue-500 border border-white rounded-full"
                                            style={{ zIndex: project.members.length - index }}
                                        >
                                            {getInitials(member.email)}
                                            <button
                                                onClick={() => handleRemoveMember(member._id, project._id)}
                                                className="absolute top-0 flex items-center justify-center w-4 h-4 p-1 text-xs text-red-500 transform translate-x-1/2 -translate-y-1/2 bg-white border border-red-500 rounded-full right-2 hover:bg-gray-200"
                                                aria-label={`Remove ${member.email}`}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                    {project.members.length > 4 && (
                                        <div className="relative z-10 flex items-center justify-center w-8 h-8 text-sm font-bold text-gray-600 bg-gray-200 border border-white rounded-full">
                                            +{project.members.length - 4}
                                        </div>
                                    )}
                                    {/* Add Member Circle */}
                                    <button
                                        onClick={() => handleAddMemberClick(project._id)}
                                        className="relative z-0 flex items-center justify-center w-8 h-8 text-lg text-gray-500 border-2 border-gray-400 border-dotted rounded-full"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Project Start/End Date */}
                                <p className="text-sm text-gray-500">Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500">End Date: {new Date(project.endDate).toLocaleDateString()}</p>

                                {/* Public/Private Switch */}
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm text-gray-700">
                                        {project.isPrivate ? 'Private' : 'Public'}
                                    </span>
                                    <Switch
                                        checked={project.isPrivate}
                                        onChange={() => togglePrivacy(project._id, project.isPrivate)}
                                        className={`${project.isPrivate ? 'bg-red-500' : 'bg-green-500'
                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out`}
                                    >
                                        <span
                                            className={`${project.isPrivate ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out`}
                                        />
                                    </Switch>
                                </div>

                                {/* View Project Link */}
                                <Link to={`/projects/${project._id}`} className="inline-block px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700">View Project</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4">No projects found. Please create a new project.</p>
                )}
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Next
                </button>
            </div>

            {/* Optional: Page size selector */}
            <div>
                <label>
                    Items per page:
                    <select
                        className="p-2 mb-4 ml-4 border border-gray-300 rounded-md"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </label>
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                onAddMembers={handleAddMembers}
                selectedUsers={currentProjectMembers}
            />
        </HomeLayout>
    );
};

export default ProjectListing;
