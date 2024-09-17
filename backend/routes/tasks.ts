import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import mongoose from 'mongoose';
import Event from '../models/Event';

const router = express.Router();

// Create a new task in a project
router.post('/:projectId/tasks/create', protect, async (req: Request, res: Response) => {
    try {
        const { title, description, assignedTo, status, priority, dueDate } = req.body;
        const project = await Project.findById(req.params.projectId);
        if (!assignedTo) {
            return res.status(200).json({ status: 400, data :{ message: 'AssignedTo is required' } });
        }
        if (!mongoose.isValidObjectId(assignedTo)) {
            return res.status(200).json({ status: 400, data: { message: 'Invalid assignedTo value, must be a valid ObjectId' } });
        }
        const assignedPerson = await User.findById(assignedTo);
        if (!assignedPerson) {
            return res.status(200).json({ status: 400, data :{ message: 'AssignedTo not found' } });
        }
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        const task = new Task({
            title ,
            description,
            project: req.params.projectId,
            assignedTo,
            status,
            priority,
            dueDate,
        })
        const savedTask = await task.save();

        const event = new Event({
            message: `Task "${savedTask.title}" has been created.`,
            projectId: req.params.projectId,
            taskId: savedTask._id,
            createdAt: new Date().toISOString(),
        })
        await event.save();

        res.status(200).json({ status: 201, data :{ message: 'Task created successfully', task: savedTask } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// get all tasks in a project
router.get('/:projectId/tasks', protect, async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'email');
        res.status(200).json({ status: 200, data :{ message: 'Tasks fetched successfully', tasks: tasks } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

//update a task by ID
router.put('/:projectId/tasks/:taskId', protect, async (req: Request, res: Response) => {
    try {
        const { title, description, assignedTo, status, priority, dueDate } = req.body;
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }

        if (!project.members.includes(req.user?._id)) {
            return res.status(200).json({ status: 403, data: { message: 'Forbidden'} });
        }
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(200).json({ status: 404, data :{ message: 'Task not found' } });
        }
        // Prepare the message for the event
        let updateMessage = `Task "${task.title}" has been updated.`;
        if (title && task.title !== title) {
            updateMessage += ` Title changed to "${name}".`;
        }
        if (description && task.description !== description) {
            updateMessage += ` Description updated.`;
        }
        if (assignedTo && task.assignedTo != assignedTo._id) {
            updateMessage += ` Assigned to ${assignedTo.email}.`;
        }
        if (status && task.status !== status) {
            updateMessage += ` Status changed to "${status}".`;
        }
        if (priority && task.priority !== priority) {
            updateMessage += ` Priority changed to "${priority}".`;
        }
        if (dueDate && task.dueDate !== dueDate) {
            updateMessage += ` Due date updated.`;
        }
        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        const savedTask = await task.save();
        
        const event = new Event({
            message: updateMessage,
            projectId: req.params.projectId,
            taskId: savedTask._id,
            createdAt: new Date().toISOString(),
        })
        await event.save();
        
        res.status(200).json({ status: 200, data :{ message: 'Task updated successfully', task: savedTask } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// delete a task by ID
router.delete('/:projectId/tasks/:taskId', protect, async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        if (!project.members.includes(req.user?._id)) {
            return res.status(200).json({ status: 403, data: { message: 'Forbidden'} });
        }
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(200).json({ status: 404, data :{ message: 'Task not found' } });
        }
        const event = new Event({
            message: `Task "${task.title}" has been deleted.`,
            projectId: req.params.projectId,
            taskId: task._id,
            createdAt: new Date().toISOString(),
        })
        await event.save();

        await task.deleteOne();
        res.status(200).json({ status: 200, data :{ message: 'Task deleted successfully' } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

export default router