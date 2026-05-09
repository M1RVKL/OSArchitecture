export class UpdateOrderStatusUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * @param {Object} params
     * @param {string} params.orderId
     * @param {string} params.action - дія ('accept', 'ready', 'assign_courier', 'deliver', 'complete', 'cancel')
     * @param {string} [params.courierId] - потрібен лише для assign_courier
     */
    async execute({ orderId, action, courierId }) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error('Замовлення не знайдено');
        }

        switch (action) {
            case 'accept':
                order.acceptByRestaurant();
                break;
            case 'ready':
                order.markAsReady();
                break;
            case 'assign_courier':
                order.assignCourier(courierId);
                break;
            case 'deliver':
                order.startDelivery();
                break;
            case 'complete':
                order.completeDelivery();
                break;
            case 'cancel':
                order.cancel();
                break;
            default:
                throw new Error('Невідома дія зі статусом');
        }

        await this.orderRepository.save(order);

        return {
            orderId: order.id,
            status: order.status,
            courierId: order.courierId
        };
    }
}