import express, { Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
const router = express.Router();
router.put('/user/:id/role', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { roleId } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(200).json({ status: 404, data: {message: 'User not found'} });
        }
        const role = await Role.findOne({ _id: roleId });
        if (!role) {
            return res.status(200).json({ message: 'Invalid role provided' });
        }

        user.role = role._id;
        await user.save();
        res.status(200).json({ status: 200, data: {message: 'User role updated successfully'} });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status:500, data: {message: 'Server error'} });
    }
})