import prisma from '../../../infrastructure/database/prisma.js';

export class GetOrderByIdQueryHandler {
    async execute(query) {
        const order = await prisma.order.findUnique({
            where: { id: query.orderId },
            include: { order_items: { include: { menu_item: true } } }
        });

        if (!order) throw new Error('Замовлення не знайдено');

        return {
            orderId: order.id,
            status: order.status,
            totalPrice: Number(order.total_price),
            deliveryAddress: order.delivery_address,
            items: order.order_items.map(item => ({
                name: item.menu_item.name,
                quantity: item.quantity,
                priceAtPurchase: Number(item.price_at_purchase)
            }))
        };
    }
}