import { Router } from 'express';
import { createOrder, updateOrderStatus } from '../controllers/orderController.js';
const router = Router();

router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;