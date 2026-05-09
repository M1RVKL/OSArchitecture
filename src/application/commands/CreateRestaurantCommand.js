export class CreateRestaurantCommand {
    constructor({ managerId, name, address }) {
        this.managerId = managerId;
        this.name = name;
        this.address = address;
    }
}