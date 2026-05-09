import express from 'express';
import cors from 'cors';
import { errorHandler } from './presentation/middleware/errorHandler.js';
import restaurantRoutes from './presentation/routes/restaurantRoutes.js';
import menuRoutes from './presentation/routes/menuRoutes.js';
import orderRoutes from './presentation/routes/orderRoutes.js';
import authRoutes from './presentation/routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ресурс не знайдено' });
});

app.use(errorHandler);

export default app;