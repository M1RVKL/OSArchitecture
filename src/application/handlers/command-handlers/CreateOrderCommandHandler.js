import { OrderItem } from '../../../domain/entities/OrderItem.js';
import crypto from 'crypto';

export class CreateOrderCommandHandler {
    constructor(orderFactory, orderRepository, menuRepository) {
        this.orderFactory = orderFactory;
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
    }

    async execute(command) {
        const order = await this.orderFactory.createNewOrder(
            command.customerId,
            command.restaurantId,
            command.deliveryAddress
        );

        for (const itemDto of command.items) {
            const menuItem = await this.menuRepository.findById(itemDto.menuItemId);
            if (!menuItem || !menuItem.isAvailable) {
                throw new Error(`Страва ${itemDto.menuItemId} недоступна`);
            }

         const orderItem = new OrderItem(
    menuItem.id,
    menuItem.name,
    itemDto.quantity,
    menuItem.price
);

            order.addItem(orderItem);
        }

        await this.orderRepository.save(order);

        return order.id;
    }
}