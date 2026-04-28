process.env.JWT_SECRET = 'test_secret_key_123';
import request from 'supertest';
import app from '../../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth API', () => {
    
    beforeEach(async () => {
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.menuItem.deleteMany({});
        await prisma.restaurant.deleteMany({});
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('реєстрація має працювати (201) і блокувати дублікати (409)', async () => {
        const user = { email: 'test@test.com', 
            password: '123', 
            name: 'Тест',
            phone: '1234567890'
        };
        
        const res1 = await request(app).post('/api/auth/register').send(user);
        if (res1.statusCode === 500) {
        console.log('Помилка сервера (500):', res1.body);   
    }
        expect(res1.statusCode).toBe(201);
        
        const res2 = await request(app).post('/api/auth/register').send(user);
        expect(res2.statusCode).toBe(409);
    });

    test('логін має працювати для зареєстрованого користувача', async () => {
        const user = { email: 'login@test.com', 
            password: '123', 
            name: 'Логін Тест',
            phone: '0987654321'
        };

        await request(app).post('/api/auth/register').send(user); 
        
        const res = await request(app).post('/api/auth/login').send(user); 
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('валідація має повертати 400 для порожніх даних', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.statusCode).toBe(400);
    });
});