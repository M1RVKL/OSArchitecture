import prisma from '../database/prisma.js';
import { RestaurantMapper } from '../mappers/RestaurantMapper.js';

export class PrismaRestaurantRepository {
    async findById(id) {
        const raw = await prisma.restaurant.findUnique({ where: { id } });
        return RestaurantMapper.toDomain(raw);
    }

    async findAllActive() {
        const rawList = await prisma.restaurant.findMany({ where: { is_active: true } });
        return rawList.map(RestaurantMapper.toDomain);
    }

    async save(domainRestaurant) {
        const data = RestaurantMapper.toPersistence(domainRestaurant);
        const saved = await prisma.restaurant.upsert({
            where: { id: data.id },
            update: data,
            create: data
        });
        return RestaurantMapper.toDomain(saved);
    }
}