import mongoose, { Schema, Document } from "mongoose";

export interface IAccounting extends Document {
    contractStartDate: Date;
    taxIncluded: boolean;
    documents: string[];
    createdAt: Date;
    updatedAt: Date;
}
const AccountingSchema: Schema = new Schema({
    contractStartDate: { type: Date, required: true },
    taxIncluded: { type: Boolean, required: true },
    documents: { type: [String], required: true },
}, { timestamps: true });


export default mongoose.model<IAccounting>('Accounting', AccountingSchema)