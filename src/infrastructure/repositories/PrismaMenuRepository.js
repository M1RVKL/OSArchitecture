import prisma from '../database/prisma.js';
import { MenuMapper } from '../mappers/MenuMapper.js';

export class PrismaMenuRepository {
    async findById(id) {
        const raw = await prisma.menuItem.findUnique({ where: { id } });
        return MenuMapper.toDomain(raw);
    }

    async findByRestaurantId(restaurantId) {
        const rawList = await prisma.menuItem.findMany({
            where: { restaurant_id: restaurantId, is_available: true }
        });
        return rawList.map(MenuMapper.toDomain);
    }

    async save(domainMenuItem) {
        const data = MenuMapper.toPersistence(domainMenuItem);
        const saved = await prisma.menuItem.upsert({
            where: { id: data.id },
            update: data,
            create: data
        });
        return MenuMapper.toDomain(saved);
    }
}