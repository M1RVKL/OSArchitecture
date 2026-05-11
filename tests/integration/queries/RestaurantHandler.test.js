import request from 'supertest';
import app from '../../../src/app.js';
import prisma from '../../../src/infrastructure/database/prisma.js';
import crypto from 'crypto';

describe('Restaurant Queries (Integration)', () => {
    const managerId = crypto.randomUUID();
    const rest1Id = crypto.randomUUID();
    const rest2Id = crypto.randomUUID();

    beforeAll(async () => {
       await prisma.$executeRawUnsafe(`TRUNCATE TABLE "order_items", "menu_items", "restaurants", "users" CASCADE;`);

        await prisma.user.create({
            data: {
                id: managerId,
                email: 'manager-fin@test.com',
                name: 'Boss',
                password_hash: 'hash',
                phone: '+380997778899',
                role: 'MANAGER'
            }
        });

        await prisma.restaurant.createMany({
            data: [
                { 
                    id: rest1Id, 
                    name: 'Активна Піца', 
                    address: { city: 'Kyiv' }, 
                    manager_id: managerId,
                    is_active: true,
                    rating: 4.8
                },
                { 
                    id: rest2Id, 
                    name: 'Зачинене Кафе', 
                    address: { city: 'Lviv' }, 
                    manager_id: managerId,
                    is_active: false,
                    rating: 3.0
                }
            ]
        });
    });

    test('GET /api/restaurants має повертати тільки активні заклади', async () => {
        const response = await request(app).get('/api/restaurants');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Активна Піца');
        expect(typeof response.body[0].rating).toBe('number');
    });

    test('GET /api/restaurants/:id має повертати деталі конкретного ресторану', async () => {
        const response = await request(app).get(`/api/restaurants/${rest1Id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(rest1Id);
        expect(response.body.isActive).toBe(true);
    });

    test('GET /api/restaurants/:id має повертати 404 для неіснуючого ID', async () => {
        const fakeId = crypto.randomUUID();
        const response = await request(app).get(`/api/restaurants/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toContain('не знайдено');
    });
});