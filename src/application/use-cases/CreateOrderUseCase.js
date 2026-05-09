import { OrderItem } from '../../domain/entities/OrderItem.js';
import crypto from 'crypto';

export class CreateOrderUseCase {
    constructor(orderFactory, orderRepository, menuRepository) {
        this.orderFactory = orderFactory;
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
    }

    /**
     * @param {Object} dto - Дані від контролера
     */
    async execute(dto) {
        const order = await this.orderFactory.createNewOrder(
            dto.customerId,
            dto.restaurantId,
            dto.deliveryAddress
        );

        for (const itemDto of dto.items) {
            // Йдемо в БД за стравою (через порт/репозиторій меню)
            const menuItem = await this.menuRepository.findById(itemDto.menuItemId);
            if (!menuItem || !menuItem.isAvailable) {
                throw new Error(`Страва ${itemDto.menuItemId} недоступна`);
            }

            const orderItem = new OrderItem({
                id: crypto.randomUUID(),
                orderId: order.id,
                menuItemId: menuItem.id,
                quantity: itemDto.quantity,
                priceAtPurchase: menuItem.price // Value object Price
            });

            order.addItem(orderItem);
        }

        await this.orderRepository.save(order);

        return {
            orderId: order.id,
            status: order.status,
            totalPrice: order.calculateTotalAmount().amount
        };
    }
}