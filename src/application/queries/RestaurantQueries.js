export class GetActiveRestaurantsQuery {}

export class GetRestaurantByIdQuery {
    constructor(id) {
        this.id = id;
    }
}