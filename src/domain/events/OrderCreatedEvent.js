export class OrderCreatedEvent {
    constructor({ orderId, customerId, restaurantId }) {
        this.name = 'OrderCreatedEvent';
        this.orderId = orderId;
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.timestamp = new Date();

        Object.freeze(this);
    }
}