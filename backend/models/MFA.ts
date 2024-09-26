import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IMFA extends Document {
  userId: IUser['_id'];
  method: 'sms' | 'email' | 'app';
  contact: string;
  verified: boolean;
}

const mfaSchema = new Schema<IMFA>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, enum: ['sms', 'email', 'app'], required: true },
  contact: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

export default mongoose.model<IMFA>('MFA', mfaSchema);
