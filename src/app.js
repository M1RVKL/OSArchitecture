import express from 'express';
import cors from 'cors';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Мідлвари
app.use(cors());
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuRoutes);
app.use('/api/orders', orderRoutes);

// Роут для обробки 404 (Незнайдений ресурс)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ресурс не знайдено' });
});

// Глобальний обробник помилок (для зручного повернення 400 та 409 статусів з бізнес-логіки)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Внутрішня помилка сервера'
    });
});

export default app;