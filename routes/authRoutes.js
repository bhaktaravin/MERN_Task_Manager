import express from 'express';
import {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUserRole,
    deactivateUser
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword
} from '../middleware/authValidation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateUpdateProfile, updateProfile);
router.put('/change-password', authenticate, validateChangePassword, changePassword);

// Admin only routes
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.put('/users/:userId/role', authenticate, authorize('admin'), updateUserRole);
router.put('/users/:userId/deactivate', authenticate, authorize('admin'), deactivateUser);

export default router;
