import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Базова валідація
        if (!email || !password) {
            const err = new Error('Email та пароль є обов’язковими');
            err.statusCode = 400;
            throw err;
        }

        // 2. Перевірка на існування користувача через Prisma
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            const err = new Error('Користувач з таким email вже існує');
            err.statusCode = 409;
            throw err;
        }

        // 3. Хешування
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Створення користувача
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'Користувача створено успішно', userId: newUser.id });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Пошук користувача
        const user = await prisma.user.findUnique({ where: { email } });
        
        // 2. Перевірка пароля
        const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordValid) {
            const err = new Error('Невірний email або пароль');
            err.statusCode = 401; 
            throw err;
        }

        // 3. Генерація токена
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};