import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import Project from '../models/Project';
import Task from '../models/Task';
import Event from '../models/Event';
import ProjectService from '../services/ProjectService';
import mongoose, { ObjectId } from 'mongoose';

const router = express.Router();
// Create a new project

router.post('/create', protect, async (req: Request, res: Response) => {
    try {
        const { name , description, members, isPrivate } = req.body;
        const ownerId = String(req.user?._id);
        await ProjectService.validateProject({ name, description, isPrivate, ownerId  });
        const memberIds = members ? members.map((id: string) => new mongoose.Types.ObjectId(id)) : [];
        const createdProject = await ProjectService.createProject({
            name,
            description,
            owner: ownerId,
            members: [ownerId, ...memberIds],
            isPrivate
        });

        const populatedProject = await ProjectService.populateProject(createdProject);

        res.status(200).json({ status: 201, data :{ message: 'Project created successfully', project: populatedProject } });
    } catch (error) {
        res.status(200).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// get all projects for the authenticated user
router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const searchQuery = req.query.search as string || '';
        const userId = String(req.user?._id);

        const result = await ProjectService.getUserProjects(userId, searchQuery, page, limit);
        res.status(200).json({
            status: 200,
            data :{
                message: 'Projects fetched successfully',
                projects: result.projects,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// get a specific project by ID
router.get('/:projectId', protect, async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { project, tasks, events } = await ProjectService.getProjectDetails(projectId);
        res.status(200).json({ status: 200, data :{ message: 'Project fetched successfully', project, tasks, events } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// update a project by ID
router.put('/:projectId', protect, async (req: Request, res: Response) => {
    try {
        const userdId = String(req.user?._id);
        const { projectId }  = req.params;
        const updatedProject = await ProjectService.updateProject(projectId, userdId, req.body);
        res.status(200).json({ status: 200, data :{ message: 'Project updated successfully', project: updatedProject } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// delete a project by ID
router.delete('/:projectId', protect, async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const result = await ProjectService.deleteProject(projectId, String(req.user?._id));
        res.status(200).json({ status: 200, data : result });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
});
export default router