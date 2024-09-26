import mongoose, { Document, Schema } from "mongoose";

export interface IUserRole extends Document {
    userId: Schema.Types.ObjectId;
    roleId: Schema.Types.ObjectId;
    assignedAt: Date;
}
const userRoleSchema = new Schema<IUserRole>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    assignedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUserRole>('UserRole', userRoleSchema)