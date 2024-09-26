import mongoose from "mongoose";
import Customer from "../models/Customer";
import Accounting from "../models/Accounting";
import Insurance from "../models/Insurance";
import Tax from "../models/Tax";

class CustomerService {
    async getCustomers(userId: string, limit: number, searchQuery: string, page: number) {
        const customers = await Customer.find()
            .populate('accountings')
            .populate('insurances')
            .populate('taxes');
        return customers;
    }


    async createCustomer({
        firstName,
        lastName,
        companyName,
        dateOfBirth,
        phoneNumber,
        address,
        postalCode,
        city,
        email,
        idOrPassport,

        accountingDocuments,
        contractStartDate,

        insurances,
        taxes
    }: {
        firstName: string,
        lastName: string,
        companyName: string,
        dateOfBirth: Date,
        phoneNumber: string,
        address: string,
        postalCode: string,
        city: string,
        email: string,

        idOrPassport: string,
        contractStartDate: Date,
        accountingDocuments?: string[],

        insurances: { type: string, agency: string, insuranceNumber: string, startDate: Date, endDate: Date, cancellationPeriod: number, amountToPay: number, paymentFrequency: string }[],
        taxes?: { name: string, percentage: number, type: string, documents: string }[]
    }
    ) {
        if (!firstName || !lastName || !dateOfBirth || !phoneNumber || !address || !postalCode || !city || !email || !idOrPassport || !insurances || !contractStartDate || !taxes) {
            throw new Error('All fields are required');
        }
        const existingCustomer = await Customer.findOne({ idOrPassport });
        if (existingCustomer) {
            throw new Error('Customer already exists');
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const newCustomer = await Customer.create({
                firstName,
                lastName,
                companyName,
                dateOfBirth,
                phoneNumber,
                address,
                postalCode,
                city,
                email,
                idOrPassport,
                insurances: [],
                accountings: [],
                taxes: [],
            });

            newCustomer.save();

            const newAccounting = new Accounting({
                contractStartDate,
                documents: accountingDocuments ?? [],
            })

            newCustomer.accountings.push(newAccounting._id as string);
            await newAccounting.save();


            if (taxes) {
                for (const tax of taxes) {
                    const newTax = new Tax({
                        name: tax.name,
                        amount: tax.percentage,
                        type: tax.type,
                        documents: tax.documents
                    })
                    await newTax.save();
                    newCustomer.taxes.push(newTax._id as string);
                }

            }

            if (insurances) {
                for (const insurance of insurances) {
                    const newInsurance = new Insurance({
                        type: insurance.type,
                        agency: insurance.agency,
                        insuranceNumber: insurance.insuranceNumber,
                        startDate: insurance.startDate,
                        endDate: insurance.endDate,
                        cancellationPeriod: insurance.cancellationPeriod,
                        amountToPay: insurance.amountToPay,
                        paymentFrequency: insurance.paymentFrequency
                    })
                    await newInsurance.save();
                    newCustomer.insurances.push(newInsurance._id as string);
                }
            }

            await session.commitTransaction();
            session.endSession();
            return newCustomer;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async getCustomerById(customerId: string) {
        const customer = await Customer.findById(customerId)
            .populate('accountings')
            .populate('insurances')
            .populate('taxes');

        if (!customer) {
            throw new Error('Customer not found');
        }

        return { customer };
    }
}

export default new CustomerService()