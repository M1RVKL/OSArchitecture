export class UpdateOrderStatusCommand {
    constructor({ orderId, action, courierId }) {
        this.orderId = orderId;
        this.action = action;
        this.courierId = courierId;
    }
}