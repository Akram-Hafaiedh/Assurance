import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    userId: string;
    action: string;
    timestamp: Date;
    details: string;
}

const auditLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
});

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
