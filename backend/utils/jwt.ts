import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const generateAccessToken = (userEmail: string) => {
    return jwt.sign({ email: userEmail }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '3h' })
}

export const generateRefreshToken = (userEmail: string) => {
    return jwt.sign({ email: userEmail }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '7d' })
}

export const verifyToken = async (token: string) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch (error) {
        throw new Error('Invalid token');
    }
}
