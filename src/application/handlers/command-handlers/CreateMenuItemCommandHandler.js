import crypto from 'crypto';
import { MenuItem } from '../../../domain/entities/MenuItem.js';
import { Price } from '../../../domain/value-objects/Price.js';

export class CreateMenuItemCommandHandler {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(command) {
        const menuItem = new MenuItem({
            id: crypto.randomUUID(),
            restaurantId: command.restaurantId,
            name: command.name,
            price: new Price(command.price),
            isAvailable: command.isAvailable ?? true
        });
        
        await this.menuRepository.save(menuItem);
        return menuItem.id;
    }
}