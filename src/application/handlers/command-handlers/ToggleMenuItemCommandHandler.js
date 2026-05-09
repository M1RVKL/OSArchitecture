export class ToggleMenuItemCommandHandler {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(command) {
        const menuItem = await this.menuRepository.findById(command.menuItemId);
        if (!menuItem) throw new Error('Страву не знайдено');

        menuItem.setAvailability(command.isAvailable);

        await this.menuRepository.save(menuItem);
        return;
    }
}