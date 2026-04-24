import { Router } from 'express';
import { createMenuItem, getMenuByRestaurant, updateMenuItem } from '../controllers/menuController.js';
const router = Router();

router.post('/', createMenuItem);
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.patch('/:id', updateMenuItem);

export default router;