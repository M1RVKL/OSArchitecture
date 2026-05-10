import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../infrastructure/database/prisma.js';

export class LoginQueryHandler {
    async execute(query) {
        const user = await prisma.user.findUnique({
            where: { email: query.email }
        });

        if (!user || !(await bcrypt.compare(query.password, user.password_hash))) {
            const err = new Error('Невірний email або пароль');
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token };
    }
}