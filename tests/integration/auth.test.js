import request from 'supertest';
import app from '../../src/app.js';

describe('Auth API', () => {

    test('реєстрація має працювати (201) і блокувати дублікати (409)', async () => {
        const user = { email: 'test@test.com', password: '123' };
        
        // 1. Успішна реєстрація
        const res1 = await request(app).post('/api/auth/register').send(user);
        expect(res1.statusCode).toBe(201);
        
        // 2. Спроба зареєструвати той самий email (Конфлікт)
        const res2 = await request(app).post('/api/auth/register').send(user);
        expect(res2.statusCode).toBe(409);
    });

    test('логін має працювати для зареєстрованого користувача', async () => {
        const user = { email: 'login@test.com', password: '123' };
        await request(app).post('/api/auth/register').send(user); // Реєструємо
        
        const res = await request(app).post('/api/auth/login').send(user); // Логінимось
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('валідація має повертати 400 для порожніх даних', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.statusCode).toBe(400);
    });
});