import { Router } from 'express';
import {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantMenu
} from '../controllers/restaurantController.js';
import auth from '../middleware/authorization.js';

const router = Router();

// POST /api/restaurants
router.post('/', auth, createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.patch('/:id', auth, updateRestaurant);
router.delete('/:id', auth, deleteRestaurant); 
router.get('/:id/menu', getRestaurantMenu);

export default router;