import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import Project from '../models/Project';
import Task from '../models/Task';
import Event from '../models/Event';

const router = express.Router();
// Create a new project
router.post('/create', protect, async (req: Request, res: Response) => {
    try {
        const { name , description, members, startDate, endDate, isPrivate } = req.body;
        if (!name) {
            return res.status(200).json({ status: 400, data :{ message: 'Name is required' } });
        }

        const project = new Project({
            name,
            description : description ?? '',
            owner: req.user?._id,
            members: members ? [req.user?._id, ...members ] : [req.user?._id], // Owner is automatically a member
            tasks: [],
            startDate: startDate ?? new Date(),
            isPrivate: isPrivate,
            endDate: endDate ?? new Date(),
        })
        const savedProject = await project.save();
        await savedProject.populate('owner', 'email');
        await savedProject.populate('members', 'email');
        res.status(200).json({ status: 201, data :{ message: 'Project created successfully', project: savedProject } });
    } catch (error) {
        res.status(200).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// get all projects for the authenticated user
router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search as string || '';

        const projects = await Project.find({
            members: req.user?._id,
            name: { $regex: searchQuery, $options: 'i' },
        })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'email')
            .populate('members', 'email');

        const totalProjects = await Project.countDocuments({
            members: req.user?._id,
            name: { $regex: searchQuery, $options: 'i' },
        });
        
        const totalPages = Math.ceil(totalProjects / limit);
        
        res.status(200).json({
            status: 200,
            data :{
                message: 'Projects fetched successfully',
                projects: projects,
                totalPages,
                currentPage: page,
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// get a specific project by ID
router.get('/:projectId', protect, async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('owner', 'email').populate('members', 'email');
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'email');
        const events = await Event.find({ projectId: project._id }).sort({ createdAt: -1 });


        res.status(200).json({ status: 200, data :{ message: 'Project fetched successfully', project, tasks, events } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// update a project by ID
router.put('/:projectId', protect, async (req: Request, res: Response) => {
    try {
        const { name, description, members, isPrivate } = req.body;
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        // Only the owner can update the project
        if (String(project.owner) !== String(req.user?._id)) {
            return res.status(403).json({ status: 403, data : { message: 'Forbidden' } });
        }

        if (typeof isPrivate !== 'undefined') {
            project.isPrivate = isPrivate;
        }
        if (members && Array.isArray(members)) {
            // project.members = members;
            project.members = [...new Set([...project.members, ...members])];

        }
        project.name = name || project.name;
        project.description = description || project.description;
        // project.members = members || project.members;

        const updatedProject = await project.save();
        res.status(200).json({ status: 200, data :{ message: 'Project updated successfully', project: updatedProject } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

// delete a project by ID
router.delete('/:projectId', protect, async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        // Only the owner can delete the project
        if (String(project.owner) !== String(req.user?._id)) {
            return res.status(403).json({ status: 403, data: { message: 'Forbidden'} });
        }
        await project.deleteOne();
        res.status(200).json({ status: 200, data :{ message: 'Project deleted successfully' } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
});
export default router