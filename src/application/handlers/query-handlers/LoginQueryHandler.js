import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../infrastructure/database/prisma.js';

export class LoginQueryHandler {
    async execute(query) {
        const user = await prisma.user.findUnique({
            where: { email: query.email }
        });

       if (!user || !(await bcrypt.compare(query.password, user.password_hash))) {
            throw new Error('Користувача не знайдено або пароль невірний');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token };
    }
}