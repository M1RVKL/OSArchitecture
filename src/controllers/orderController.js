import prisma from '../prisma.js';
import { 
    isOrderEmpty, 
    calculateTotal, 
    canCancelOrder, 
    validateCourierAssignment 
} from '../utils/orderLogic.js';

export const createOrder = async (req, res, next) => {
    try {
        const { customer_id, restaurant_id, delivery_address, items } = req.body;

        //  валідація
        if (isOrderEmpty(items)) {
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
        if (status === 'CANCELLED' && !canCancelOrder(currentStatus)) {
    return res.status(400).json({
        error: 'Замовлення вже готується або в дорозі. Скасування неможливе.'
    });
}

        //Обробка рестораном
        // Логіка підтвердження та приготування
        if (['ACCEPTED', 'PREPARING', 'READY'].includes(status)) {// Тут можна додати перевірку ролі менеджера (коли буде готова автентифікація)
            console.log(`[Сповіщення]: Клієнт отримав статус: ${status}`);
        }

        //Прийняття кур'єром
        if (courier_id) {
    const validation = validateCourierAssignment(currentStatus, order.courier_id, courier_id);
    if (!validation.allowed) {
        return res.status(400).json({ error: validation.error });
    }
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