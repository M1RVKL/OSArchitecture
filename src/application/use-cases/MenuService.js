import crypto from 'crypto';
import { MenuItem } from '../../domain/entities/MenuItem.js';
import { Price } from '../../domain/value-objects/Price.js';

export class MenuService {
    constructor(menuRepository) {
        this.menuRepo = menuRepository;
    }

    async createMenuItem(dto) {
        const menuItem = new MenuItem({
            id: crypto.randomUUID(),
            restaurantId: dto.restaurantId,
            name: dto.name,
            price: new Price(dto.price),
            isAvailable: dto.isAvailable ?? true
        });
        return await this.menuRepo.save(menuItem);
    }

    async getMenuForRestaurant(restaurantId) {
        return await this.menuRepo.findByRestaurantId(restaurantId);
    }

    async toggleAvailability(id, isAvailable) {
        const menuItem = await this.menuRepo.findById(id);
        if (!menuItem) throw new Error('Страву не знайдено');

        menuItem.isAvailable = isAvailable;

        return await this.menuRepo.save(menuItem);
    }
}