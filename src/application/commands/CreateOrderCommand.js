export class CreateOrderCommand {
    constructor({ customerId, restaurantId, deliveryAddress, items }) {
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.items = items;
    }
}