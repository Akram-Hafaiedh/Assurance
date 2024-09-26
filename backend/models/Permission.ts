import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
    name: string;
    description: string;
}

const permissionSchema: Schema<IPermission> = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

export default mongoose.model<IPermission>('Permission', permissionSchema);
