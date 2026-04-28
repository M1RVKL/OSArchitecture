process.env.JWT_SECRET = 'test_secret_key_123';
import request from 'supertest';
import app from '../../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integration Test: Menu API', () => {
    let token = '';
    let restaurantId = '';
    let menuItemId = '';

    beforeEach(async () => {
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.menuItem.deleteMany({});
        await prisma.restaurant.deleteMany({});
        await prisma.user.deleteMany({});

        const userData = { email: 'menu@test.com', password: '123', name: 'Test', phone: '123456789' };
        await request(app).post('/api/auth/register').send(userData);
        
        const loginRes = await request(app).post('/api/auth/login').send({ 
            email: userData.email, password: userData.password 
        });
        token = loginRes.body.token;

        const user = await prisma.user.findUnique({ where: { email: userData.email } });
        const restRes = await request(app)
            .post('/api/restaurants')
            .set('Authorization', `Bearer ${token}`)
            .send({ manager_id: user.id, name: 'Test Restaurant', address: { city: 'Kyiv' } });
        
        restaurantId = restRes.body.id; 

        const itemRes = await request(app)
            .post('/api/menu-items')
            .set('Authorization', `Bearer ${token}`)
            .send({ restaurant_id: restaurantId, name: 'Базова Піца', price: 100 });
        
        menuItemId = itemRes.body.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/menu-items', () => {
        test('має створювати страву при коректних даних', async () => {
            const res = await request(app)
                .post('/api/menu-items')
                .set('Authorization', `Bearer ${token}`)
                .send({ 
                    restaurant_id: restaurantId, 
                    name: 'Піца Пепероні', 
                    price: 250, 
                    is_available: true 
                });
            expect(res.statusCode).toBe(201);
        });
        
        test('має повертати 400, якщо ціна <= 0', async () => {
            const res = await request(app)
                .post('/api/menu-items')
                .set('Authorization', `Bearer ${token}`)
                .send({ 
                    restaurant_id: restaurantId,
                    name: 'Безкоштовна Піца', 
                    price: 0 
                });
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/menu-items/restaurant/:id', () => {
        test('має повертати список страв для ресторану', async () => {
            const res = await request(app).get(`/api/menu-items/restaurant/${restaurantId}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('PATCH /api/menu-items/:id', () => {
        test("має повертати 400 при спробі встановити від'ємну ціну", async () => {
            const res = await request(app)
                .patch(`/api/menu-items/${menuItemId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ price: -10 });
            
            expect(res.statusCode).toBe(400);
        });
    });
});