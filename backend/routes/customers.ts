import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import CustomerService from '../services/CustomerService';
const router = express.Router();

router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const searchQuery = req.query.search as string || '';
        const userId = String(req.user?._id);

        const customers = await CustomerService.getCustomers(userId, limit, searchQuery, page);
        res.status(200).json({ status: 200, data: { message: 'Customers fetched successfully', customers } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
})

router.post('/create', protect, async (req: Request, res: Response) => {
    try {
        const newCustomer = await CustomerService.createCustomer(req.body);
        res.status(201).json({ status: 201, data: { message: 'Customer created successfully', customer: newCustomer } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
})

router.get('/:customerId', protect, async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        const { customer } = await CustomerService.getCustomerById(customerId);
        res.status(200).json({ status: 200, data: { message: 'Customer fetched successfully', customer } });
    } catch (error) {
        res.status(500).json({ status: 500, data: { message: 'Server error', error } });
    }
})

export default router
