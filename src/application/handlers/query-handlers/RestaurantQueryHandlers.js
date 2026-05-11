import prisma from '../../../infrastructure/database/prisma.js';

export class GetActiveRestaurantsQueryHandler {
    async execute(query) {
        const rawRestaurants = await prisma.restaurant.findMany({
            where: { is_active: true }
        });

        return rawRestaurants.map(r => ({
            id: r.id,
            name: r.name,
            rating: Number(r.rating) || 0,
            address: r.address
        }));
    }
}

export class GetRestaurantByIdQueryHandler {
    async execute(query) {
        let finalId;
        if (typeof query === 'string') {
            finalId = query;
        } else {
            finalId = query.restaurantId || query.id;
        }

        if (typeof finalId === 'object' && finalId !== null) {
            finalId = finalId.restaurantId || finalId.id;
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: finalId }
        });

        if (!restaurant) throw new Error('Ресторан не знайдено');

        return {
            id: restaurant.id,
            name: restaurant.name,
            rating: Number(restaurant.rating) || 0,
            address: restaurant.address,
            isActive: restaurant.is_active
        };
    }
}