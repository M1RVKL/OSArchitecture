import { Router } from 'express';
import {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/restaurantController.js';
import auth from '../middleware/authorization.js';

const router = Router();

// POST /api/restaurants
router.post('/', auth, createRestaurant);           // C: Створити новий
router.get('/', getAllRestaurants);           // R: Отримати всі
router.get('/:id', getRestaurantById);        // R: Отримати один за ID
router.patch('/:id', auth, updateRestaurant);       // U: Оновити частково
router.delete('/:id', auth, deleteRestaurant);      // D: Видалити (м'яко)

export default router;