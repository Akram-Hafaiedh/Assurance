import express, { Request, Response } from 'express';
import User from '../models/User';
const router = express.Router();
import { protect } from '../middleware/authMiddleware';


// Get user profile
router.get('/me', protect, async (req : Request, res: Response) => {
    if (req.user) {
        const user = await User.findById(req.user?.id).populate('role', 'name').select('-password');
        res.status(200).json({ status:200, data:{ user} });
    } else {
        res.status(200).json({ status:401, data:{ message: 'Unauthorized' } });
    }
});

// Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.find().populate('role', 'name');
        res.status(200).json({ status: 200, data :{ message: 'Users fetched successfully', users: users } });
    } catch (error) {
        res.status(500).json({ status: 500, data :{ message: 'Server error', error } });
    }
})

export default router