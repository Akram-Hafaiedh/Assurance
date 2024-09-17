import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { ITask } from "./Task";
export interface IProject extends Document {
    name : string;
    description : string;
    owner : IUser['_id'];
    members : IUser['_id'][];
    taks: ITask['_id'][];
    startDate?: Date;  // Optional start date
    endDate?: Date;    // Optional end date
    isPrivate : boolean;
    createdAt: Date;
    updatedAt: Date;
}
const projectSchema = new Schema<IProject>({
    name : { type: String, required: true },
    description : { type: String },
    owner : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members : [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    isPrivate : { type: Boolean, default: false },
    startDate: { type: Date },  // Optional
    endDate: { type: Date },    // Optional
}, { timestamps: true });

export default mongoose.model<IProject>('Project', projectSchema);