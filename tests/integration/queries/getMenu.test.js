import request from 'supertest';
import app from '../../../src/app.js';
import prisma from '../../../src/infrastructure/database/prisma.js';
import crypto from 'crypto';

describe('GetMenuForRestaurant (Integration)', () => {
    // Генеруємо валідні UUID
    const restaurantId = crypto.randomUUID();
    const item1Id = crypto.randomUUID();
    const item2Id = crypto.randomUUID();
    const otherRestId = crypto.randomUUID();

    const managerId = crypto.randomUUID();

beforeAll(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "order_items", "menu_items", "restaurants", "users" CASCADE;`);
    await prisma.user.create({
        data: {
            id: managerId,
            email: 'manager@test.com',
            name: 'Test Manager',
            password_hash: 'hash_placeholder',
            phone: '+380991234567',
            role: 'MANAGER'
        }
    });

    await prisma.restaurant.createMany({
        data: [
            { 
                id: restaurantId, 
                name: 'Тестовий ресторан', 
                address: { city: 'Kyiv', street: 'Polytechnic' }, 
                manager_id: managerId 
            },
            { 
                id: otherRestId, 
                name: 'Інший ресторан', 
                address: { city: 'Kyiv', street: 'Metalurhiv' }, 
                manager_id: managerId 
            }
        ]
    });

    await prisma.menuItem.createMany({
        data: [
            {
                id: item1Id,
                restaurant_id: restaurantId,
                name: 'Борщ',
                price: 120.50,
                is_available: true
            },
            {
                id: item2Id,
                restaurant_id: restaurantId,
                name: 'Салат',
                price: 80.00,
                is_available: false
            }
        ]
    });
});
    test('GET /api/restaurants/:id/menu має повертати правильний список Read Models', async () => {
        const response = await request(app)
            .get(`/api/restaurants/${restaurantId}/menu`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toEqual({
            id: item1Id,
            name: 'Борщ',
            price: 120.5
        });
    });
});