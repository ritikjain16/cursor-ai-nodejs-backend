import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  verifyRazorpayPayment
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes are protected

router.route('/')
  .post(createOrder);

router.get('/myorders', getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.post('/:id/verify-payment', verifyRazorpayPayment);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router; 