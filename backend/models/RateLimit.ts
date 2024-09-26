import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IRateLimit extends Document {
    userId: IUser['_id'];
    endpoint: string;
    requestCount: number;
    windowStart: Date;
}

const rateLimitSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    endpoint: { type: String, required: true },
    requestCount: { type: Number, default: 0 },
    windowStart: { type: Date, default: Date.now }
});

module.exports = mongoose.model<IRateLimit>('RateLimit', rateLimitSchema);
