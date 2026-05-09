import { Order } from '../../domain/entities/Order.js';
import { OrderItem } from '../../domain/entities/OrderItem.js';
import { Address } from '../../domain/value-objects/Address.js';

export class OrderMapper {
    /**
     * Перетворює об'єкт Prisma (БД) у Доменну сутність
     */
    static toDomain(rawPrismaOrder) {
        if (!rawPrismaOrder) return null;

        const deliveryAddress = new Address(rawPrismaOrder.delivery_address);

        const items = rawPrismaOrder.order_items ? rawPrismaOrder.order_items.map(item => {
            return new OrderItem({
                id: item.id,
                orderId: item.order_id,
                menuItemId: item.menu_item_id,
                quantity: item.quantity,
                priceAtPurchase: Number(item.price_at_purchase)
            });
        }) : [];

        return new Order({
            id: rawPrismaOrder.id,
            customerId: rawPrismaOrder.customer_id,
            restaurantId: rawPrismaOrder.restaurant_id,
            deliveryAddress: deliveryAddress,
            status: rawPrismaOrder.status,
            courierId: rawPrismaOrder.courier_id,
            items: items
        });
    }

    /**
     * Перетворює Доменну сутність у формат, який розуміє Prisma для збереження
     */
    static toPersistence(domainOrder) {
        return {
            id: domainOrder.id,
            customer_id: domainOrder.customerId,
            restaurant_id: domainOrder.restaurantId,
            courier_id: domainOrder.courierId,
            status: domainOrder.status,
            total_price: domainOrder.calculateTotalAmount().amount,
            delivery_address: domainOrder.deliveryAddress.toJSON(),

            // Форматуємо order_items для Prisma 
            order_items: domainOrder.items.map(item => ({
                id: item.id,
                menu_item_id: item.menuItemId,
                quantity: item.quantity,
                price_at_purchase: item.priceAtPurchase.amount
            }))
        };
    }
}