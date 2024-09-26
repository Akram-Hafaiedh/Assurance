import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';
import Role from '../models/Role';

import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
dotenv.config();

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser: IUser | null = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ status: 400, data: { message: 'User already exists' } });
        }

        const role = await Role.findOne({ name: 'employee' });
        if (!role) {
            return res.status(500).json({ message: 'Default employee role not found in the system' });
        }

        // Create new user
        const user: IUser = new User({ email, password, role: role._id });
        await user.save();

        res.status(200).json({ status: 201, data: { message: 'User created successfully' } });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: 500, data: { message: 'Server error', error: error } });
    }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ status: 400, data: { message: 'Invalid email or password' } });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(200).json({ status: 400, data: { message: 'Invalid email or Qpassword' } });
        }

        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use only in HTTPS in production
            sameSite: 'none', // Allows the cookie to be sent in cross-origin requests
            // sameSite: 'strict', // Prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        console.log(refreshToken, accessToken);
        console.log(user.refreshToken);

        res.status(200).json({ status: 200, data: { message: 'Login successful', token: accessToken } });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: 500, data: { message: 'Server error', err: error } });
    }
});

router.post('/refresh-token', async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(200).json({ status: 400, data: { message: 'No token provided' } });
    }
    try {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, async (err: any, decoded: any) => {
            if (err) return res.status(200).json({ status: 400, data: { message: 'Invalid token' } });
            const user: IUser | null = await User.findOne({ email: decoded.email });
            if (!user || user.refreshToken !== token) {
                return res.status(200).json({ status: 400, data: { message: 'Invalid token' } });
            } else {
                const accessToken = generateAccessToken(user.email);
                const refreshToken = generateRefreshToken(user.email);
                user.refreshToken = refreshToken;
                await user.save();

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true, // Prevent access via JavaScript
                    secure: process.env.NODE_ENV === 'production', // Use only in HTTPS in production
                    sameSite: 'strict', // Prevent CSRF
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
                });
                return res.status(200).json({ status: 200, data: { message: 'Refresh token successful', token: accessToken } });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(200).json({ status: 500, data: { message: 'Server error', err: error } });
    }
});

export default router;