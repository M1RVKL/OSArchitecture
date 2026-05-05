import { Restaurant } from '../../domain/entities/Restaurant.js';
import { Address } from '../../domain/value-objects/Address.js';

export class RestaurantMapper {
    static toDomain(raw) {
        if (!raw) return null;
        return new Restaurant({
            id: raw.id,
            managerId: raw.manager_id,
            name: raw.name,
            address: new Address(raw.address),
            rating: raw.rating ? Number(raw.rating) : 0,
            isActive: raw.is_active
        });
    }

    static toPersistence(domain) {
        return {
            id: domain.id,
            manager_id: domain.managerId,
            name: domain.name,
            // Якщо address - це Value Object, він має метод toJson() або ми беремо його поля
            address: domain.address,
            rating: domain.rating,
            is_active: domain.isActive
        };
    }
}