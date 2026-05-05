import prisma from '../prisma.js';

export const createMenuItem = async (req, res, next) => {
    try {
        const { restaurant_id, name, price, is_available } = req.body;

        // Інваріанти
        if (!restaurant_id || !name || price === undefined) {
            return res.status(400).json({ error: 'Потрібні дані: restaurant_id, name, price' });
        }
        if (price <= 0) {
            return res.status(400).json({ error: 'Ціна має бути більшою за 0' });
        }

        const newItem = await prisma.menuItem.create({
            data: { restaurant_id, name, price, is_available }
        });
        res.status(201).json(newItem);
    } catch (error) { next(error); }
};

export const getMenuByRestaurant = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const menu = await prisma.menuItem.findMany({
            where: { restaurant_id: restaurantId, is_available: true }
        });
        res.status(200).json(menu);
    } catch (error) { next(error); }
};

export const updateMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { price, is_available, name } = req.body;

        if (price !== undefined && price <= 0) {
            return res.status(400).json({ error: 'Ціна має бути більшою за 0' });
        }

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: { name, price, is_available }
        });
        res.status(200).json(updatedItem);
    } catch (error) { next(error); }
};