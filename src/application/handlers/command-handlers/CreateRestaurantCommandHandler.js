import crypto from 'crypto';
import { Restaurant } from '../../../domain/entities/Restaurant.js';
import { Address } from '../../../domain/value-objects/Address.js';

export class CreateRestaurantCommandHandler {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    async execute(command) {
        const restaurant = new Restaurant(
            crypto.randomUUID(),
            command.name,
            new Address(command.address),
            true
        );
        
        await this.restaurantRepository.save(restaurant);
        return restaurant.id;
    }
}