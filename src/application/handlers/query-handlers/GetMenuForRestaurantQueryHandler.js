import prisma from '../../../infrastructure/database/prisma.js';

export class GetMenuForRestaurantQueryHandler {
    async execute(query) {
        const rawMenu = await prisma.menuItem.findMany({
            where: {
                restaurant_id: query.restaurantId,
                is_active: true
            }
        });

        return rawMenu.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price)
        }));
    }
}