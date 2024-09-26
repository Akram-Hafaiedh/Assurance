import mongoose, { Schema, Document } from "mongoose";

export interface IInsurance extends Document {
    type: string;
    agency: string;
    insuranceNumber: string;
    startDate: Date;
    endDate: Date;
    cancellationPeriod: number;
    amountToPay: number;
    paymentFrequency: string;
    createdAt: Date;
    updatedAt: Date;
}

const InsuranceSchema = new Schema<IInsurance>({
    type: { type: String, required: true },
    agency: { type: String, required: true },
    insuranceNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    cancellationPeriod: { type: Number, required: true },
    amountToPay: { type: Number, required: true },
    paymentFrequency: { type: String, enum: ['Monthly', 'Yearly', 'Semi-Annual', 'Quarterly'], default: 'Monthly' },
}, { timestamps: true });



export default mongoose.model<IInsurance>('Insurance', InsuranceSchema)