import mongoose, { Schema, Document } from "mongoose";

export interface ITax extends Document {
    name: string;
    amount: number;
    type: string;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}
const taxSchema: Schema<ITax> = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    documents: { type: [String], required: true },
}, { timestamps: true });

export default mongoose.model<ITax>('Tax', taxSchema)