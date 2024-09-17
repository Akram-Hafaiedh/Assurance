import mongoose, { Schema, Document } from "mongoose";
import { IProject } from "./Project";
import { ITask } from "./Task";

interface IEvent extends Document {
    projectId : IProject['_id'];
    taskId: ITask['_id'];
    message : string;    
    createdAt: Date;
}
const eventSchema = new Schema<IEvent>({
    projectId : { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: false },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEvent>('Event', eventSchema)