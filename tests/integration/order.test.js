process.env.JWT_SECRET = 'test_secret_key_123';
import request from 'supertest';
import app from '../../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Integration Test: Order API', () => {
    let token = '';
    let restaurantId = '';
    let menuItemId = '';
    let orderId = '';
    let userId = '';

    beforeAll(async () => {
        // Очищення БД в правильному порядку (видаляємо залежні записи спочатку)
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.menuItem.deleteMany({});
        await prisma.restaurant.deleteMany({});
        await prisma.user.deleteMany({});

        // 1. Реєстрація та логін
        const userData = { email: 'client@test.com', password: '123', name: 'Client', phone: '0000000000' };
        await request(app).post('/api/auth/register').send(userData);
        const loginRes = await request(app).post('/api/auth/login').send({ email: userData.email, password: '123' });
        token = `Bearer ${loginRes.body.token}`;

        const user = await prisma.user.findUnique({ where: { email: userData.email } });
        userId = user.id;

        // 2. Створення ресторану (додаємо manager_id, як вимагав сервер)
        const restRes = await request(app)
            .post('/api/restaurants')
            .set('Authorization', token)
            .send({ 
                name: 'Test Rest', 
                address: { city: 'Kyiv', street: 'Main St' },
                manager_id: userId 
            });
        
        if (!restRes.body.id) throw new Error(`Не вдалося створити ресторан: ${JSON.stringify(restRes.body)}`);
        restaurantId = restRes.body.id;

        // 3. Створення страви
        const menuRes = await request(app)
            .post('/api/menu-items')
            .set('Authorization', token)
            .send({ 
                restaurant_id: restaurantId, 
                name: 'Pizza', 
                price: 100,
                is_available: true 
            });
        
        if (!menuRes.body.id) throw new Error(`Не вдалося створити страву: ${JSON.stringify(menuRes.body)}`);
        menuItemId = menuRes.body.id;

        // 4. Створення замовлення
        const orderRes = await request(app)
            .post('/api/orders')
            .set('Authorization', token)
            .send({ 
                customer_id: userId,
                restaurant_id: restaurantId,
                order_items: [{ menu_item_id: menuItemId, quantity: 1 }],
                delivery_address: { street: 'Main St', city: 'Kyiv' }
            });
        
        if (!orderRes.body.id) throw new Error(`Не вдалося створити замовлення: ${JSON.stringify(orderRes.body)}`);
        orderId = orderRes.body.id;
    });

    afterAll(async () => { await prisma.$disconnect(); });

    describe('POST /api/orders', () => {
        test('успішне створення замовлення', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', token)
                .send({ 
                    customer_id: userId,
                    restaurant_id: restaurantId,
                    order_items: [{ menu_item_id: menuItemId, quantity: 1 }],
                    delivery_address: { street: 'Main St', city: 'Kyiv' }
                });
            expect(res.statusCode).toBe(201);
        });

        test('помилка 400, якщо страва недоступна', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', token)
                .send({ 
                    customer_id: userId,
                    restaurant_id: restaurantId,
                    order_items: [{ menu_item_id: '00000000-0000-0000-0000-000000000000', quantity: 1 }],
                    delivery_address: { street: 'Main St', city: 'Kyiv' }
                });
            expect(res.statusCode).toBe(400); 
        });
    });

    describe('PATCH /api/orders/:id/status', () => {
        test('помилка 400 при спробі скасувати замовлення, що вже в дорозі', async () => {
            // Спочатку переводимо в DELIVERING
            await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .set('Authorization', token)
                .send({ status: 'DELIVERING' });
            
            // Намагаємось скасувати
            const res = await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .set('Authorization', token)
                .send({ status: 'CANCELLED' });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Скасування неможливе.');
        });
    });
});