import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IRole } from './Role';

export interface IUser extends Document {
    email: string;
    password: string;
    verified: boolean;
    role : IRole['_id'];
    refreshToken: string;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    refreshToken: { type: String },
}, { timestamps: true });

// Hash the password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);