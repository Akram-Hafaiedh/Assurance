import mongoose from "mongoose";
import Role from "../models/Role";
import dotenv from 'dotenv';
import User from "../models/User";
dotenv.config();

const seedUserRoles = async () => {
    const mongoUri = process.env.MONGO_URI
    try {
        await mongoose.connect(mongoUri as string);
        const employeeRole = await Role.findOne({ name: 'employee' });
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!employeeRole || !adminRole) {
            throw new Error('Roles not found. Please seed roles first.');
        }
        const users = await User.find();

        if (users.length > 0) {
            users[0].role = adminRole._id;
            await users[0].save();

            for (const user of users) {
                if (!user.role) {
                    user.role = employeeRole._id;
                    await user.save();
                }
            }

            console.log('User roles seeded successfully!');
        } else {
            console.log('No users found in the database.');
        }
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding roles:', error);
        mongoose.disconnect();
    }
}

seedUserRoles();