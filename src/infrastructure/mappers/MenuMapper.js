import { MenuItem } from '../../domain/entities/MenuItem.js';
import { Price } from '../../domain/value-objects/Price.js';

export class MenuMapper {
    static toDomain(raw) {
        if (!raw) return null;
        return new MenuItem({
            id: raw.id,
            restaurantId: raw.restaurant_id,
            name: raw.name,
            price: new Price(Number(raw.price)),
            isAvailable: raw.is_available
        });
    }

    static toPersistence(domain) {
        return {
            id: domain.id,
            restaurant_id: domain.restaurantId,
            name: domain.name,
            price: domain.price.amount, // Дістаємо чисте число з Value Object
            is_available: domain.isAvailable
        };
    }
}