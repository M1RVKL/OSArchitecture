import { jest } from '@jest/globals';
import { RegisterUserCommandHandler } from '../../../src/application/handlers/command-handlers/RegisterUserCommandHandler.js';
import { FakeUserRepository } from '../../../src/infrastructure/database/fakes/FakeUserRepository.js';

describe('RegisterUserCommandHandler (Unit with Fake)', () => {
    let fakeRepo;
    let mockFactory;
    let handler;

    beforeEach(() => {
        fakeRepo = new FakeUserRepository();
        
        // Мокаємо фабрику, щоб не залежати від логіки створення сутності
        mockFactory = {
            createNewUser: jest.fn().mockResolvedValue({
                id: 'user-uuid-123',
                email: { value: 'test@mail.com' },
                name: 'Vladyslav'
            })
        };

        handler = new RegisterUserCommandHandler(mockFactory, fakeRepo);
    });

    test('має успішно зареєструвати користувача та зберегти його у FakeUserRepository', async () => {
        // Arrange
        const command = {
            email: 'test@mail.com',
            password: 'securePassword123',
            name: 'Vladyslav',
            phone: '380990000000',
            role: 'customer'
        };

        // Act
        const resultId = await handler.execute(command);

        // Assert
        const savedUser = await fakeRepo.findByEmail('test@mail.com');
        
        expect(resultId).toBe('user-uuid-123');
        expect(savedUser).toBeDefined();
        expect(savedUser.name).toBe('Vladyslav');
        expect(mockFactory.createNewUser).toHaveBeenCalled();
    });

    test('має викинути помилку, якщо пароль відсутній', async () => {
        // Arrange
        const command = {
            email: 'test@mail.com',
            name: 'Vladyslav'
            // password відсутній
        };

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow('Пароль є обов’язковим');
        
        // Перевіряємо, що в репозиторій нічого не потрапило
        expect(fakeRepo.users.size).toBe(0);
    });
});