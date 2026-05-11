import { Router } from 'express';
import { createOrder, updateOrderStatus, getOrderById } from '../controllers/orderController.js';
import auth from '../middleware/authorization.js';

const router = Router();

router.post('/', auth, createOrder);
router.patch('/:id/status', auth, updateOrderStatus);
router.get('/:id', auth, getOrderById);

export default router;