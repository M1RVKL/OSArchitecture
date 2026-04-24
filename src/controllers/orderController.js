import prisma from '../prisma.js';

export const createOrder = async (req, res, next) => {
    try {
        const { customer_id, restaurant_id, delivery_address, items } = req.body;

        //  валідація
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Замовлення не може бути порожнім' });
        }

        // або створюється все, або нічого
        const newOrder = await prisma.$transaction(async (tx) => {
            let total_price = 0;
            const orderItemsData = [];

            // переіврк кожної страви та підрахунок ціни
            for (const item of items) {
                const menuItem = await tx.menuItem.findUnique({
                    where: { id: item.menu_item_id }
                });

                if (!menuItem || !menuItem.is_available) {
                    throw new Error(`Страва з ID ${item.menu_item_id} недоступна`);
                }

                const itemTotal = menuItem.price * item.quantity;
                total_price += itemTotal;

                orderItemsData.push({
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    price_at_purchase: menuItem.price
                });
            }

            // створення замовлення разом із деталями (OrderItem)
            return await tx.order.create({
                data: {
                    customer_id,
                    restaurant_id,
                    delivery_address,
                    total_price,
                    status: 'CREATED',
                    order_items: {
                        create: orderItemsData
                    }
                },
                include: { order_items: true }
            });
        });

        res.status(201).json(newOrder);
    } catch (error) {
        if (error.message.includes('недоступна')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, courier_id } = req.body;

        const existingOrder = await prisma.order.findUnique({ where: { id } });
        if (!existingOrder) return res.status(404).json({ error: 'Замовлення не знайдено' });

        // не можна скасувати замовлення, яке вже доставляється
        if (status === 'CANCELLED' && ['DELIVERING', 'DELIVERED'].includes(existingOrder.status)) {
            return res.status(400).json({ error: 'Неможливо скасувати замовлення, що вже в дорозі' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status, courier_id }
        });

        res.status(200).json(updatedOrder);
    } catch (error) { next(error); }
};