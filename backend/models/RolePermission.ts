import mongoose, { Document, Schema } from "mongoose";

interface IRolePermission extends Document {
    roleId: Schema.Types.ObjectId
    permissionId: Schema.Types.ObjectId
    grantedAt: Date
}
const rolePermissionSchema = new Schema<IRolePermission>({
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    permissionId: { type: Schema.Types.ObjectId, ref: 'Permission', required: true },
    grantedAt: { type: Date, default: Date.now }
})

export default mongoose.model<IRolePermission>('RolePermission', rolePermissionSchema)