import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Реєстрація нового користувача
router.post('/register', register);

// Вхід у систему (отримання токена)
router.post('/login', login);

export default router;