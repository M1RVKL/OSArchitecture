process.env.JWT_SECRET = 'test_secret_key_123';
import request from 'supertest';
import app from '../../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); 

describe('Courier API', () => {
    let tokenA = '';
    let tokenB = '';
    let orderId = '';


   beforeAll(async () => {
        
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.menuItem.deleteMany({});
        await prisma.restaurant.deleteMany({});
        await prisma.user.deleteMany({});

        const courierA = { email: 'courierA@test.com', password: '123', name: 'Courier A', phone: '111' };
        const courierB = { email: 'courierB@test.com', password: '123', name: 'Courier B', phone: '222' };
        
        await request(app).post('/api/auth/register').send(courierA);
        await request(app).post('/api/auth/register').send(courierB);

        const resA = await request(app).post('/api/auth/login').send({ email: courierA.email, password: '123' });
        const resB = await request(app).post('/api/auth/login').send({ email: courierB.email, password: '123' });
        tokenA = `Bearer ${resA.body.token}`;
        tokenB = `Bearer ${resB.body.token}`;

        const user = await prisma.user.findUnique({ where: { email: courierA.email } });

        const restRes = await request(app)
            .post('/api/restaurants')
            .set('Authorization', tokenA)
            .send({ manager_id: user.id, name: 'Test Rest', address: { city: 'Kyiv' } });
        
        const restaurantId = restRes.body.id;

        const menuRes = await request(app)
            .post('/api/menu-items')
            .set('Authorization', tokenA)
            .send({ restaurant_id: restaurantId, name: 'Pizza', price: 100 });
        const menuItemId = menuRes.body.id;

        const orderRes = await request(app)
            .post('/api/orders')
            .set('Authorization', tokenA)
            .send({
                customer_id: user.id,
                restaurant_id: restaurantId,
                order_items: [{ menu_item_id: menuItemId, quantity: 1 }],
                delivery_address: { street: 'Main St', city: 'Kyiv' }
            });

            if (orderRes.statusCode !== 201) {
            console.log('--- ПОМИЛКА СТВОРЕННЯ ЗАМОВЛЕННЯ ---');
            console.log('Статус:', orderRes.statusCode);
            console.log('Тіло помилки:', orderRes.body);
            console.log('Дані, що відправляли:', {
                restaurant_id: restaurantId,
                menu_item_id: menuItemId
            });
        }
            
        orderId = orderRes.body.id;

        if (!orderId) {
            throw new Error('Не вдалося створити замовлення в beforeAll!');
        }
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('PATCH /api/orders/:id/status має повертати 409, якщо замовлення вже взяли', async () => {
        await request(app)
            .patch(`/api/orders/${orderId}/status`)
            .set('Authorization', tokenA)
            .send({ status: 'DELIVERING' });
        
        const res = await request(app)
            .patch(`/api/orders/${orderId}/status`)
            .set('Authorization', tokenB)
            .send({ status: 'DELIVERING' });
        
        expect(res.statusCode).toBe(409);
    });
});