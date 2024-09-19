import mongoose, { Schema, Document } from "mongoose";
import { IProject } from "./Project";
import { ITask } from "./Task";
import { IUser } from "./User";

interface IEvent extends Document {
    projectId : IProject['_id'];
    userId: IUser['_id'];
    action : string;
    description : string;    
    createdAt: Date;
}
const eventSchema = new Schema<IEvent>({
    projectId : { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
}, {timestamps:{createdAt: true, updatedAt: false}});

export default mongoose.model<IEvent>('Event', eventSchema)