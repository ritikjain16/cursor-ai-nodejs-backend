import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  addCategory,
  removeCategory,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes with auth and admin middleware
router.use(protect, admin);

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product Management Routes
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id/stock', updateProductStock);

// Category Management Routes
router.post('/products/:id/categories', addCategory);
router.delete('/products/:id/categories/:categoryId', removeCategory);

// Order Management Routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Dashboard Statistics
router.get('/dashboard/stats', getDashboardStats);

export default router; 