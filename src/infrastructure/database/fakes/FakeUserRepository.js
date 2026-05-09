export class FakeUserRepository {
    constructor() {
        this.users = new Map();
    }
    async save(user) {
        this.users.set(user.id, user);
    }
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email.value === email) return user;
        }
        return null;
    }
}