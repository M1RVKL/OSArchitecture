export class CreateMenuItemCommand {
    constructor({ restaurantId, name, price, isAvailable }) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.price = price;
        this.isAvailable = isAvailable;
    }
}