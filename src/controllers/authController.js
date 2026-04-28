import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name || !phone) {
            const err = new Error('Всі поля є обов’язковими');
            err.statusCode = 400;
            throw err;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            const err = new Error('Користувач з таким email вже існує');
            err.statusCode = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                name: name || 'Користувач',
                phone: phone || null
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

        const user = await prisma.user.findUnique({ where: { email } });
        
        const isPasswordValid = user ? await bcrypt.compare(password, user.password_hash) : false;

        if (!user || !isPasswordValid) {
            const err = new Error('Невірний email або пароль');
            err.statusCode = 401; 
            throw err;
        }

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