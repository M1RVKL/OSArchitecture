import { Router } from 'express';
import { createMenuItem, getMenuByRestaurant, updateMenuItem } from '../controllers/menuController.js';
import auth from '../middleware/authorization.js';
const router = Router();

router.post('/', auth, createMenuItem);
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.patch('/:id', auth, updateMenuItem);

export default router;