import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    firstName: string;
    lastName: string;
    companyName?: string;
    dateOfBirth: Date;
    phoneNumber: string;
    address: string;
    postalCode: string;
    city: string;
    email: string;
    idOrPassport: string;
    insurances: string[];
    accountings: string[];
    taxes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema<ICustomer> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    idOrPassport: { type: String, required: true },
    insurances: [{ type: Schema.Types.ObjectId, ref: 'Insurance', required: true }],
    accountings: [{ type: Schema.Types.ObjectId, ref: 'Accounting', required: true }],
    taxes: [{ type: Schema.Types.ObjectId, ref: 'Tax', required: true}],
}, { timestamps: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);

