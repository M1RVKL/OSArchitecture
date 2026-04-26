import request from 'supertest';
import app from '../../src/app.js';

describe('Integration Test: Order API', () => {
    const validToken = '...'; 

    describe('POST /api/orders', () => {
        test('успішне створення замовлення', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ 
                    customer_id: 1, // Додали, бо контролер очікує це поле
                    restaurant_id: 1,
                    delivery_address: 'вул. Тестова 1',
                    items: [{ menu_item_id: 1, quantity: 2 }] // ВИПРАВЛЕНО: menu_item_id
                });
            
            expect(res.statusCode).toBe(201);
        });

        test('помилка 400, якщо страва недоступна', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ 
                    customer_id: 1,
                    restaurant_id: 1,
                    delivery_address: 'test',
                    items: [{ menu_item_id: 999, quantity: 1 }] // ВИПРАВЛЕНО
                });
            
            expect(res.statusCode).toBe(400); 
            expect(res.body.error).toMatch(/недоступна/);
        });
    });

    describe('PATCH /api/orders/:id/status', () => {
        test('помилка 400 при спробі скасувати доставку, що вже в дорозі', async () => {
            // Припустимо, ми знаємо ID замовлення (можна створити його в beforeEach)
            const orderId = 'some-existing-id'; 
            
            const res = await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ status: 'CANCELLED' });
            
            // Якщо orderId в дорозі, має бути 400
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Неможливо скасувати замовлення, що вже в дорозі');
        });
    });
});