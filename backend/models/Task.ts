import mongoose, { Document, Schema } from "mongoose";
import { IProject } from "./Project";
import { IUser } from "./User";
export interface ITask extends Document {
    title : string;
    description : string;
    project: IProject ['_id'];
    assignedTo: IUser['_id'];
    status: string;
    priority: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title : { type: String, required: true },
    description : { type: String },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do'},
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low'},
    dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema)