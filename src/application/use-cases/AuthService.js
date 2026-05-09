import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
    constructor(userFactory, userRepository) {
        this.userFactory = userFactory;
        this.userRepository = userRepository;
    }

    async register({ email, name, phone, password, role = 'CUSTOMER' }) {
        if (!password) {
            throw new Error('Пароль є обов’язковим');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.userFactory.createNewUser(email, name, phone, passwordHash, role);

        await this.userRepository.save(user);

        return {
            userId: user.id,
            email: user.email.value,
            phone: user.phone,
            role: user.role
        };
    }

    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

        if (!user || !isPasswordValid) {
            const err = new Error('Невірний email або пароль');
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email.value, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token };
    }
}