import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';
import { getAllUsers, getAllOrders, deleteProduct } from '../controllers/adminController';

const router = express.Router();

router.use(protect, admin);

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.delete('/product/:id', deleteProduct);

export default router;
