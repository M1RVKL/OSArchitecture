import { DomainError } from '../exceptions/DomainError.js';
import { Price } from '../value-objects/Price.js';

export class MenuItem {
    constructor({ id, restaurantId, name, price, isAvailable = true }) {
        if (!id || !restaurantId || !name) {
            throw new DomainError('MenuItem повинен мати id, restaurantId та name');
        }
        if (!(price instanceof Price)) {
            throw new DomainError('price має бути об\'єктом Price');
        }

        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.price = price;
        this.isAvailable = isAvailable;
    }

    toggleAvailability(status) {
        this.isAvailable = status;
    }
}