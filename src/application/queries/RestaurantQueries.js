export class GetActiveRestaurantsQuery {}

export class GetRestaurantByIdQuery {
    constructor(id) {
        this.id = id;
    }
}

export class GetMenuForRestaurantQuery {
    constructor({ restaurantId }) {
        this.restaurantId = restaurantId;
    }
}