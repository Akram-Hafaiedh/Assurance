import express, { Request, Response } from 'express'
import Role from '../models/Role';
import { protect } from '../middleware/authMiddleware';
const router = express.Router();

router.post('create', protect, async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ status: 400, data: { message: 'Name and description are required' } });
        }
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ status: 400, data: { message: 'Role already exists' } });
        }

        const newRole = new Role({ name, description });
        await newRole.save();

        res.status(200).json({ status: 201, data: { message: 'Role created successfully' } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
});

router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ status: 200, data: { message: 'Roles fetched successfully', roles } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
});

router.get('/:roleId', protect, async (req: Request, res: Response) => {
    try {
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            return res.status(200).json({ status: 404, data: { message: 'Role not found' } });
        }
        res.status(200).json({ status: 200, data: { message: 'Role fetched successfully', role } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
});

router.put('/:roleId', protect, async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            return res.status(200).json({ status: 404, data: { message: 'Role not found' } });
        }
        role.name = name;
        role.description = description;
        await role.save();

        res.status(200).json({ status: 200, data: { message: 'Role updated successfully' } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
});


export default router;