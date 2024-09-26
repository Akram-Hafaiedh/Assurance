import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { protect } from "../middleware/authMiddleware";
import taskGroupService from "../services/taskGroupService";

const router = express.Router();

router.post('/:projectId/task-groups/create', protect, async (req: Request, res: Response) => {
    try {
        const { name, color } = req.body;
        const projectId = req.params.projectId;
        const userId = String(req.user?._id);
        
        const newTaskGroup = await taskGroupService.createTaskGroup({
            tasks : [],
            projectId,
            name,
            color,
            userId,
        });

        res.status(200).json({ status: 200, data: { message: 'Task group created successfully', taskGroup: newTaskGroup } });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, data: { message: 'Server error' } });
    }
})



export default router;