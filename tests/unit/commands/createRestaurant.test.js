import { CreateRestaurantCommandHandler } from '../../../src/application/handlers/command-handlers/CreateRestaurantCommandHandler.js';
import { FakeRestaurantRepository } from '../../../src/infrastructure/database/fakes/FakeRestaurantRepository.js';

describe('CreateRestaurantCommandHandler (Unit with Fake)', () => {
    let fakeRepo;
    let handler;

    beforeEach(() => {
        // Ініціалізація фейкового репозиторію
        fakeRepo = new FakeRestaurantRepository();
        handler = new CreateRestaurantCommandHandler(fakeRepo);
    });

    test('має успішно створити ресторан та зберегти його у Fake репозиторій', async () => {
        // 1. Arrange: Готуємо дані команди (DTO)
        const command = {
            name: 'Pizzeria Romana',
            address: { 
                city: 'Kyiv', 
                street: 'Shevchenka', 
                flat: '10' 
            }
        };

        // 2. Act: Виконуємо команду
        const resultId = await handler.execute(command);

        // 3. Assert: Перевіряємо стан фейкового репозиторію
        const savedRestaurant = await fakeRepo.findById(resultId);
        
        expect(resultId).toBeDefined();
        expect(savedRestaurant).toBeDefined();
        expect(savedRestaurant.name).toBe('Pizzeria Romana');
        expect(savedRestaurant.address.city).toBe('Kyiv');
    });

    test('має викинути помилку, якщо інваріанти адреси порушені', async () => {
        // Arrange: Неповна адреса (наприклад, без вулиці)
        const command = {
            name: 'Invalid Rest',
            address: { city: 'Kyiv' } 
        };

        // Act & Assert: Очікуємо доменну помилку
        await expect(handler.execute(command)).rejects.toThrow();
        
        // Перевірка, що в базі порожньо
        const active = await fakeRepo.findAllActive();
        expect(active.length).toBe(0);
    });
});