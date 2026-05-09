export class FakeRestaurantRepository {
    constructor() {
        this.restaurants = new Map();
    }
    async save(restaurant) {
        this.restaurants.set(restaurant.id, restaurant);
    }
    async findById(id) {
        return this.restaurants.get(id) || null;
    }
    async findAllActive() {
        return Array.from(this.restaurants.values()).filter(r => r.isActive);
    }
}