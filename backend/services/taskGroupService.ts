import mongoose from "mongoose";
import TaskGroup from "../models/TaskGroup";
import Event from "../models/Event";

class taskGroupService {
    async createTaskGroup({ name, color, tasks, projectId, userId }: { name: string, color: string, tasks: string[], projectId: string , userId: string }) {
        if(!projectId){
            throw new Error('Project id is required');
        }
        if(!name || !color) {
            throw new Error('All fields are required');
        }

        const existingTaskGroup = await TaskGroup.findOne({ name, projectId });
        if (existingTaskGroup) {
            throw new Error('Task group already exists');
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try{
            const newTaskGroup = await TaskGroup.create({
                name,
                color,
                taks: tasks ?? [] ,
                projectId
            })
            newTaskGroup.save();

            const event = await Event.create({
                projectId,
                action: 'Task Group Created',
                description: `Task group "${name}" has been created.`,
                userId,
                createdAt: new Date().toISOString(),
            })
            await event.save();
            await session.commitTransaction();
            session.endSession();
            return newTaskGroup;

        }catch(error){
            
            await session.abortTransaction();
            session.endSession();
            throw error
        }

    }
}

export default new taskGroupService();