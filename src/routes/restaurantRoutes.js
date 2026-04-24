import { Router } from 'express';
import {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/restaurantController.js';

const router = Router();

// POST /api/restaurants
router.post('/', createRestaurant);           // C: Створити новий
router.get('/', getAllRestaurants);           // R: Отримати всі
router.get('/:id', getRestaurantById);        // R: Отримати один за ID
router.patch('/:id', updateRestaurant);       // U: Оновити частково
router.delete('/:id', deleteRestaurant);      // D: Видалити (м'яко)

export default router;