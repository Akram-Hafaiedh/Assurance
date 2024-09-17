import mongoose from "mongoose";
import Role from "../models/Role";
import dotenv from 'dotenv';
dotenv.config();

const seedRoles = async () => {
    const mongoUri = process.env.MONGO_URI
    try {
        await mongoose.connect(mongoUri as string);
        const roles = [
            { name: "admin" },
            { name: "employee" },
            { name: "developer" }
        ]
        const existingRoles = await Role.find();
        if (existingRoles.length === 0) {
            await Role.insertMany(roles);
            console.log("Roles seeded successfully");
        } else {
            console.log("Roles already seeded");
        }
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding roles:', error);
        mongoose.disconnect();
    }
}

seedRoles();