export class FakeMenuRepository {
    constructor() {
        this.items = new Map();
    }

    async save(menuItem) {
        this.items.set(menuItem.id, menuItem);
    }

    async findById(id) {
        return this.items.get(id) || null;
    }

    async findByRestaurantId(restaurantId) {
        return Array.from(this.items.values()).filter(
            item => item.restaurantId === restaurantId
        );
    }
}