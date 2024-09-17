import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';
import Role from '../models/Role';
dotenv.config();

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser: IUser | null = await User.findOne({ email });
        if (existingUser) {
          return res.status(200).json({ status: 400, data: { message: 'User already exists'} });
        }
    
        const role = await Role.findOne({ name: 'employee' });
        if (!role) {
            return res.status(500).json({ message: 'Default employee role not found in the system' });
        }

        // Create new user
        const user: IUser = new User({ email, password, role: role._id });
        await user.save();

        res.status(200).json({ status: 201, data : { message: 'User created successfully'} });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: 500, data: { message: 'Server error', error : error } });
    }
});

// Login user
router.post('/login', async (req: Request , res: Response) => {
    const { email, password } = req.body;

    try {
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
          return res.status(200).json({ status: 400, data: { message: 'Invalid email or password'} });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(200).json({ status: 400, data: { message: 'Invalid email or password'} });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.status(200).json({ status: 200, data: { message: 'Login successful', token: token } });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: 500, data: { message: 'Server error', err: error } });
    }
});

export default router;