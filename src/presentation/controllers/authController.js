import { AuthService } from '../../application/use-cases/AuthService.js';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository.js';
import { UserFactory } from '../../domain/factories/UserFactory.js';

const userRepository = new PrismaUserRepository();
const userFactory = new UserFactory(userRepository);
const authService = new AuthService(userFactory, userRepository);

export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({ message: 'Користувача створено успішно', userId: result.userId });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.status(200).json(result);
    } catch (err) {
        // Специфічна обробка 401 помилки (Неавторизовано)
        if (err.statusCode === 401) {
            return res.status(401).json({ error: err.message });
        }
        next(err);
    }
};