
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/Project';
dotenv.config();
const seedProjectPrivacy = async () => {
    const mongoUri = process.env.MONGO_URI
    try {
        await mongoose.connect(mongoUri as string);
        const projects = await Project.find();
        for (const project of projects) {
            project.isPrivate = false;
            await project.save();
        }
        console.log('Project privacy successfully set to false');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding project privacy:', error);
        mongoose.disconnect();
    }
}
seedProjectPrivacy();