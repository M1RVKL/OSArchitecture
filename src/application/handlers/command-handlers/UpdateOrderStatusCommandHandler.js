export class UpdateOrderStatusCommandHandler {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(command) {
        const order = await this.orderRepository.findById(command.orderId);
        if (!order) {
            throw new Error('Замовлення не знайдено');
        }

        switch (command.action) {
            case 'accept': order.acceptByRestaurant(); break;
            case 'ready': order.markAsReady(); break;
            case 'assign_courier': order.assignCourier(command.courierId); break;
            case 'deliver': order.startDelivery(); break;
            case 'complete': order.completeDelivery(); break;
            case 'cancel': order.cancel(); break;
            default: throw new Error('Невідома дія зі статусом');
        }

        await this.orderRepository.save(order);
        
        return;
    }
}