import crypto from 'crypto';
import { Restaurant } from '../../domain/entities/Restaurant.js';
import { Address } from '../../domain/value-objects/Address.js';
import { DomainError } from '../../domain/exceptions/DomainError.js';

export class RestaurantService {
    constructor(restaurantRepository) {
        this.restaurantRepo = restaurantRepository;
    }

    async createRestaurant(dto) {
        const restaurant = new Restaurant({
            id: crypto.randomUUID(),
            managerId: dto.managerId,
            name: dto.name,
            address: new Address(dto.address)
        });
        return await this.restaurantRepo.save(restaurant);
    }

    async getAllActive() {
        return await this.restaurantRepo.findAllActive();
    }

    async getById(id) {
        const restaurant = await this.restaurantRepo.findById(id);
        if (!restaurant) throw new DomainError('Ресторан не знайдено');
        return restaurant;
    }

    async deactivateRestaurant(id) {
        const restaurant = await this.restaurantRepo.findById(id);
        if (!restaurant) throw new DomainError('Ресторан не знайдено');

        restaurant.isActive = false;

        await this.restaurantRepo.save(restaurant);
    }
}