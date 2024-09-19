import mongoose, { ObjectId } from "mongoose";
import TaskGroup from "../models/TaskGroup";
import Event from "../models/Event";
import Project, { IProject } from "../models/Project";
import Task from "../models/Task";
class ProjectService {
    async createProject(data:{
        name : string,
        description: string,
        owner : string,
        members: string[],
        isPrivate: boolean,
    }){
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const project = new Project({
                name : data.name,
                description: data.description,
                owner : data.owner,
                members: data.members,
                isPrivate: data.isPrivate
            });
            await project.save({ session });

            const taskGroups = ['Complete', 'Completed', 'In Progress'].map(name=>({
                name,
                projectId: project._id
            }));

            const createdTaskGroups = await TaskGroup.insertMany(taskGroups, {session})
            project.taskGroups = createdTaskGroups.map(group => group._id);
            await project.save({ session });

            const event = new Event({
                projectId: project._id,
                userId: data.owner,
                action: 'Project Created',
                description: `Project ${project.name} was created with default task groups`
            });

            await event.save({ session });

            await session.commitTransaction();
            session.endSession();

            return project;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async validateProject(data : {name : string, description?: string , isPrivate : boolean,  ownerId: string}){
        if (!data.name){
            throw new Error('Name is required');
        }
        if (!data.isPrivate){
            throw new Error('Project privacy must be set');
        }
        if (!data.ownerId){
            throw new Error('User is required');
        }
    }

    async populateProject(project: IProject){
        await project.populate('owner', 'email');
        await project.populate('members', 'email');
        await project.populate('taskGroups');
        return project;
    }

    async getUserProjects(userId: string, searchQuery: string, page: number, limit: number){
        const skip = (page - 1) * limit;
        const projects = await Project.find({
            members: userId,
            name: { $regex: searchQuery, $options: 'i' },
        })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'email')
            .populate('members', 'email');
            
        const totalProjects = await Project.countDocuments({
            members: userId,
            name: { $regex: searchQuery, $options: 'i' },
        });
        const totalPages = Math.ceil(totalProjects / limit);
        return { projects, totalPages, currentPage: page }
    }

    async getProjectDetails(projectId: string){
        const project = await Project.findById(projectId)
            .populate('owner', 'email')
            .populate('members', 'email');

        if (!project) {
            throw new Error('Project not found');
        }
        const [tasks, events, taskGroups] = await Promise.all([
            Task.find({ projectId }).populate('assignedTo', 'email'),
            Event.find({ projectId }).sort({ createdAt: -1 }),
            TaskGroup.find({ projectId })
        ]);
        return { project, tasks, events, taskGroups };
    }

    async updateProject(projectId: string, userId: string, data: Partial<IProject>){
        const project = await Project.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        if (String(project.owner)!== String(userId)) {
            throw new Error('Forbidden');
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (typeof data.name!== 'undefined') {
                project.name = data.name;
            }
            if (typeof data.description!== 'undefined') {
                project.description = data.description;
            }
            if (Array.isArray(data.members)) {
                project.members = [...new Set([...project.members,...data.members])];
            }
            if (typeof data.isPrivate!== 'undefined') {
                project.isPrivate = data.isPrivate;
            }
            await project.save({ session });
            await session.commitTransaction();
            session.endSession();
            return project;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async deleteProject(projectId: string, userId: string){
        const project = await Project.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        if (!userId){
            throw new Error('Forbidden');
        }
        if (String(project.owner)!== String(userId)) {
            throw new Error('Forbidden');
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            await Task.deleteMany({ projectId });
            await Event.deleteMany({ projectId });
            await TaskGroup.deleteMany({ projectId });
            await project.deleteOne();

            await session.commitTransaction();
            session.endSession();
            return { message: 'Project deleted successfully' };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

export default new ProjectService();