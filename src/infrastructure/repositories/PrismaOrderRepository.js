import prisma from '../database/prisma.js';
import { IOrderRepository } from '../../domain/ports/IOrderRepository.js';
import { OrderMapper } from '../mappers/OrderMapper.js';

export class PrismaOrderRepository extends IOrderRepository {

    async findById(id) {
        const rawOrder = await prisma.order.findUnique({
            where: { id },
            include: { order_items: true }
        });

        return OrderMapper.toDomain(rawOrder);
    }

    async save(domainOrder) {
        const data = OrderMapper.toPersistence(domainOrder);

        const savedRawOrder = await prisma.order.upsert({
            where: { id: data.id },
            update: {
                status: data.status,
                courier_id: data.courier_id,
            },
            create: {
                id: data.id,
                customer_id: data.customer_id,
                restaurant_id: data.restaurant_id,
                status: data.status,
                total_price: data.total_price,
                delivery_address: data.delivery_address,
                // Prisma вміє створювати пов'язані записи одразу
                order_items: {
                    create: data.order_items.map(item => ({
                        id: item.id,
                        menu_item_id: item.menu_item_id,
                        quantity: item.quantity,
                        price_at_purchase: item.price_at_purchase
                    }))
                }
            },
            include: { order_items: true }
        });

        return OrderMapper.toDomain(savedRawOrder);
    }
}