import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import TaskService from '../services/TaskService';

const router = express.Router();

// Create a new task in a project
router.post('/:projectId/tasks/create', protect, async (req: Request, res: Response) => {
    try {
        const { title, description, assignedTo: assignedToId, taskGroup: taskGroupId, priority, dueDate } = req.body;

        const task = await TaskService.createTask({
            title,
            description,
            projectId: req.params.projectId,
            assignedTo: assignedToId,
            taskGroup: taskGroupId,
            priority,
            dueDate,
            userId: String(req.user?._id),
        });

        res.status(200).json({ status: 201, data :{ message: 'Task created successfully', task } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// get all tasks in a project
router.get('/:projectId/tasks', protect, async (req: Request, res: Response) => {
    try {
        const tasks = await TaskService.getTasksByProjectId(req.params.projectId);
        res.status(200).json({ status: 200, data :{ message: 'Tasks fetched successfully', tasks } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

//update a task by ID
router.put('/:projectId/tasks/:taskId', protect, async (req: Request, res: Response) => {
    try {
        const { title, description, assignedTo, taskGroup, priority, dueDate } = req.body;

        const savedTask = await TaskService.updateTask({
            taskId: req.params.taskId,
            title,
            description,
            assignedTo: assignedTo || [],
            taskGroup,
            priority,
            dueDate,
            userId: String(req.user?._id),
        })
        
        res.status(200).json({ status: 200, data :{ message: 'Task updated successfully', task: savedTask } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// delete a task by ID
router.delete('/:projectId/tasks/:taskId', protect, async (req: Request, res: Response) => {
    try {
        const result = await TaskService.deleteTask(req.params.taskId, req.params.projectId, String(req.user?._id));
        res.status(200).json({ status: 200, data :{ message: 'Task deleted successfully' } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

export default router