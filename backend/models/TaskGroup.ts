import mongoose, { Document, Schema } from "mongoose";
import { ITask } from "./Task";
import { IProject } from "./Project";

export interface ITaskGroup extends Document {
    name: string,
    tasks: ITask['_id'][],
    projectId: IProject['_id'],
    createdAt: Date,
    updatedAt: Date
}

const taskGroupSchema = new Schema<ITaskGroup>({
    name : {type : String, required : true},
    tasks: [{type : Schema.Types.ObjectId, ref : 'Task'}],
    projectId : {type : Schema.Types.ObjectId, ref : 'Project', required : true},
}, {timestamps : true});

export default mongoose.model<ITaskGroup>('TaskGroup', taskGroupSchema)