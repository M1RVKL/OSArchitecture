import { RegisterUserCommand } from '../../application/commands/RegisterUserCommand.js';
import { RegisterUserCommandHandler } from '../../application/handlers/command-handlers/RegisterUserCommandHandler.js';
import { UserFactory } from '../../domain/factories/UserFactory.js';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository.js';
import { LoginQuery } from '../../application/queries/LoginQuery.js';
import { LoginQueryHandler } from '../../application/handlers/query-handlers/LoginQueryHandler.js';

const userRepository = new PrismaUserRepository();
const userFactory = new UserFactory(userRepository);
const registerHandler = new RegisterUserCommandHandler(userFactory, userRepository);
const loginHandler = new LoginQueryHandler(userRepository);

export const register = async (req, res, next) => {
    try {
        const command = new RegisterUserCommand({
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            password: req.body.password,
            role: req.body.role
        });

        const userId = await registerHandler.execute(command);
        
        res.status(201).json({ message: 'Користувача створено успішно', id: userId });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const query = new LoginQuery({
            email: req.body.email,
            password: req.body.password
        });

        const result = await loginHandler.execute(query);
        res.status(200).json(result); // Повертає { token }
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ error: err.message });
        }
        next(err);
    }
};