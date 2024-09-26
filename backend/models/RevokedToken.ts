import mongoose from 'mongoose';

export interface IRevokedToken extends Document {
    token: string;
    revokedAt: Date;
}
const revokedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    revokedAt: { type: Date, default: Date.now }
});

export default mongoose.model('RevokedToken', revokedTokenSchema);
