import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { ITask } from "./Task";
export interface IProject extends Document {
    name : string;
    description : string;
    owner : IUser['_id'];
    members : IUser['_id'][];
    taskGroups: ITask['_id'][];
    isPrivate : boolean;
    createdAt: Date;
    updatedAt: Date;
}
const projectSchema = new Schema<IProject>({
    name : { type: String, required: true },
    description : { type: String },
    owner : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members : [{ type: Schema.Types.ObjectId, ref: 'User'}],
    taskGroups: [{ type: Schema.Types.ObjectId, ref: 'TaskGroup', required: true}],
    isPrivate : { type: Boolean, default: false , required: true},
}, { timestamps: true });

export default mongoose.model<IProject>('Project', projectSchema);