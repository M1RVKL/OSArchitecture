import request from 'supertest';
import app from '../../src/app.js';

describe('Integration Test: Menu API', () => {
    const validToken = '...'; // Твій токен менеджера

    describe('POST /api/menu-items', () => {
        test('має створювати страву при коректних даних', async () => {
            const res = await request(app)
                .post('/api/menu-items')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ 
                    restaurant_id: 'some-res-id', 
                    name: 'Піца Пепероні', 
                    price: 250, 
                    is_available: true 
                });
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
        });

        test('має повертати 400, якщо ціна <= 0', async () => {
            const res = await request(app)
                .post('/api/menu-items')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ 
                    restaurant_id: 'some-res-id', 
                    name: 'Безкоштовна Піца', 
                    price: 0 
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Ціна має бути більшою за 0');
        });
    });

    describe('GET /api/menu-items/restaurant/:id', () => {
        test('має повертати список страв для ресторану', async () => {
            const res = await request(app).get('/api/menu-items/restaurant/some-res-id');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('PATCH /api/menu-items/:id', () => {
        test("має повертати 400 при спробі встановити від'ємну ціну", async () => {
            const res = await request(app)
                .patch('/api/menu-items/some-item-id')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ price: -10 });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Ціна має бути більшою за 0');
        });
    });
});