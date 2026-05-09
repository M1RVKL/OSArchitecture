import { DomainError } from '../../../domain/exceptions/DomainError.js';

export class DeactivateRestaurantCommandHandler {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    async execute(command) {
        const restaurant = await this.restaurantRepository.findById(command.restaurantId);
        if (!restaurant) throw new DomainError('Ресторан не знайдено');

        restaurant.deactivate();

        await this.restaurantRepository.save(restaurant);
        return;
    }
}