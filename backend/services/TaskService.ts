import mongoose, { ObjectId } from "mongoose";
import Project from "../models/Project";
import User from "../models/User";
import Task from "../models/Task";
import Event from "../models/Event";
import TaskGroup from "../models/TaskGroup";
class TaskService {
    async createTask({
        title,
        description,
        projectId,
        assignedTo,
        taskGroup,
        priority,
        dueDate,
        userId,
    }: {
        title: string;
        description: string;
        projectId: string;
        assignedTo: string;
        taskGroup: string;
        priority: string;
        dueDate: Date;
        userId: string;
    }){
        const project = await Project.findById(projectId);
        if (!project){
            throw new Error("Project not found");
        }
        const assignedPerson = await User.findById(assignedTo);
        if (!assignedPerson){
            throw new Error("Assigned person not found");
        }
        const assignedTaskGroup = await TaskGroup.findById(taskGroup);
        if (!assignedTaskGroup){
            throw new Error("Task group not found");
        }
        
        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            const task = new Task({
                title,
                description,
                project: projectId,
                assignedTo,
                taskGroup,
                priority,
                dueDate
            });
            const savedTask = await task.save();

            const event = new Event({
                description: `Task "${savedTask.title}" has been created.`,
                action: 'Task Created',
                projectId,
                userId,
                createdAt: new Date().toISOString(),
            });

            await event.save();


            await session.commitTransaction();
            session.endSession();
            return savedTask;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async getTasksByProjectId(projectId: string){
        const project = await Project.findById(projectId);
        if (!project){
            throw new Error("Project not found");
        }
        const tasks = await Task.find({project: projectId})
            .populate('assignedTo', 'email');
        return tasks;
    }

    async updateTask({
        taskId, title, description, assignedTo: assignedToId, taskGroup: taskGroupId, priority, dueDate, userId
    }: {
        taskId: string;
        title: string;
        description: string;
        assignedTo: string[];
        taskGroup: string;
        priority: string;
        dueDate: Date;
        userId: string;
    }){
        const task = await Task.findById(taskId);
        if (!task){
            throw new Error("Task not found");
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            task.title = title || task.title;
            task.description = description || task.description;
            task.assignedTo = [...new Set([...task.assignedTo, ...assignedToId]) ]
            task.taskGroup = taskGroupId || task.taskGroup;
            task.priority = priority || task.priority;
            task.dueDate = dueDate || task.dueDate;

            const savedTask = await task.save();

            const event = new Event({
                description: `Task "${savedTask.title}" has been updated.`,
                action: 'Task Updated',
                projectId: savedTask.projectId,
                userId,
                createdAt: new Date().toISOString(),
            });
            await event.save();
            await session.commitTransaction();
            session.endSession();
            return savedTask;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
        
    }
    async deleteTask(taskId: string, projectId: string, userId: string){
        const project = await Project.findById(projectId);
        if (!project){
            throw new Error("Project not found");
        }
        const task = await Task.findById(taskId);
        if (!task){
            throw new Error("Task not found");
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const event = new Event({
                description: `Task "${task.title}" has been deleted.`,
                action: 'Task Deleted',
                projectId,
                userId,
                createdAt: new Date().toISOString(),
            });
            await event.save();
            await Task.findByIdAndDelete(taskId);

            await session.commitTransaction();
            session.endSession();
            return {message: 'Task deleted successfully'}
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    }


}

export default new TaskService();