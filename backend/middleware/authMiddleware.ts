import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    try {
        // Check if the token exists in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {   
            // Get token from header         
            token = req.headers.authorization?.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
             // Attach the user id from the decoded token to req.user
            req.user = await User.findById(decoded.userId).select('-password');
            // Proceed to the next middleware/route handler
            if (!req.user) {
                return res.status(200).json({ status: 401, data: { message: 'User not found' }});
            }
            next();
        }
        if (!token) {
            return res.status(200).json({ status : 401, data: { message: 'Not authorized, token not found'} });
        }

    } catch (error) {
        return res.status(200).json({ status : 401, data: { message: 'Not authorized, token failed'} });
    }
}
export const isAdmin = async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(401).json({ status : 401, data: { message: 'Not authorized as admin'} });
    }
}