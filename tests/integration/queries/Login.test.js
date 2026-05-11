import request from 'supertest';
import app from '../../../src/app.js';
import prisma from '../../../src/infrastructure/database/prisma.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

process.env.JWT_SECRET = 'test-secret-key-123';

describe('LoginQueryHandler (Integration)', () => {
    const password = 'SecretPassword123';
    const email = 'vlad@example.com';

   beforeAll(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "order_items", "orders", "menu_items", "restaurants", "users" CASCADE;`);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            email: email,
            password_hash: hash,
            name: 'Vlad',
            phone: '+380991112233',
            role: 'CUSTOMER'
        }
    });
});

    test('POST /api/auth/login має повертати JWT токен при правильних даних', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: email,
                password: password
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token.split('.').length).toBe(3);
    });

    test('POST /api/auth/login має повертати 401 при невірному паролі', async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: email,
            password: 'WrongPassword'
        });

        expect(response.status).not.toBe(200); 
    expect(response.body.error).toBeDefined(); 
});
});