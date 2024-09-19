import mongoose, { Document, Schema } from "mongoose";
import { IProject } from "./Project";
import { IUser } from "./User";
import { ITaskGroup } from "./TaskGroup";
export interface ITask extends Document {
    title : string;
    description : string;
    projectId: IProject ['_id'];
    assignedTo: IUser['_id'][];
    taskGroup: ITaskGroup['_id'];
    priority: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title : { type: String, required: true },
    description : { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    taskGroup: { type: Schema.Types.ObjectId, ref: 'TaskGroup', required: true},
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low'},
    dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema)