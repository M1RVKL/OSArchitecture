import { Router } from 'express';
import { createOrder, updateOrderStatus } from '../controllers/orderController.js';
import auth from '../middleware/authorization.js';
const router = Router();

router.post('/', auth, createOrder);
router.patch('/:id/status', auth, updateOrderStatus);
export default router;