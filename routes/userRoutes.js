import express from 'express';
import {
  signup,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteUser,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUsers,
  updateUserRole
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/address', protect, addAddress);
router.put('/address/default', protect, setDefaultAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Admin routes
router.delete('/:id', protect, admin, deleteUser);
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

export default router; 