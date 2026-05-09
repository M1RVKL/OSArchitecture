import crypto from 'crypto';
import { MenuItem } from '../../../domain/entities/MenuItem.js';
import { Price } from '../../../domain/value-objects/Price.js';

export class CreateMenuItemCommandHandler {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(command) {
        const menuItem = new MenuItem(
            crypto.randomUUID(),
            command.restaurantId,
            command.name,
            new Price(command.price),
            command.isAvailable ?? true
        );
        
        await this.menuRepository.save(menuItem);
        return menuItem.id;
    }
}