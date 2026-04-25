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
            //перевірка при створенні замовлення
            const restaurant = await tx.restaurant.findUnique({
                where: { id: restaurant_id }
            });

            if (!restaurant) {
                throw new Error('Ресторан не знайдено');
            }

            if (!restaurant.is_active) {
                throw new Error('RESTAURANT_INACTIVE');
            }

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

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) return res.status(404).json({ error: 'Замовлення не знайдено' });

        const currentStatus = order.status;

        //скасування клієнтом
        if (status === 'CANCELLED') {
            const allowedForCancellation = ['CREATED', 'ACCEPTED'];
            if (!allowedForCancellation.includes(currentStatus)) {
                return res.status(400).json({
                    error: 'Замовлення вже готується або в дорозі. Скасування неможливе.'
                });
            }
            console.log(`[Сповіщення]: Ресторан отримав відміну замовлення №${id}`);
        }

        //Обробка рестораном
        // Логіка підтвердження та приготування
        if (['ACCEPTED', 'PREPARING', 'READY'].includes(status)) {// Тут можна додати перевірку ролі менеджера (коли буде готова автентифікація)
            console.log(`[Сповіщення]: Клієнт отримав статус: ${status}`);
        }

        //Прийняття кур'єром
        if (courier_id) {
            // 1. перевірка статусу
            if (!['PREPARING', 'READY'].includes(currentStatus)) {
                return res.status(400).json({ error: 'Замовлення недоступне для кур\'єра' });
            }
            // 2. чи не зайняте іншим
            if (order.courier_id && order.courier_id !== courier_id) {
                return res.status(409).json({ error: 'Замовлення вже прийняте іншим кур\'єром' });
            }
            //міняємо статус на DELIVERING при призначенні кур'єра
            req.body.status = 'DELIVERING';
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: req.body.status || status,
                courier_id
            }
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};