import express, { Request, Response } from 'express';
import Project from '../models/Project';
import Event from '../models/Event';

const router = express.Router();

router.get('/:projectId/events', async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(200).json({ status: 404, data :{ message: 'Project not found' } });
        }
        const events = await Event.find({ projectId: req.params.projectId });
        res.status(200).json({ status: 200, data :{ message: 'Events fetched successfully', events } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})


export default router