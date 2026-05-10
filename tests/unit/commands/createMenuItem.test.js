import { CreateMenuItemCommandHandler } from '../../../src/application/handlers/command-handlers/CreateMenuItemCommandHandler.js';
import { FakeMenuRepository } from '../../../src/infrastructure/database/fakes/FakeMenuRepository.js';

describe('CreateMenuItemCommandHandler (Unit with Fake)', () => {
    let fakeRepo;
    let handler;

    beforeEach(() => {
        fakeRepo = new FakeMenuRepository();
        handler = new CreateMenuItemCommandHandler(fakeRepo);
    });

    test('має успішно створити страву та зберегти її в Fake репозиторій', async () => {
        // Arrange
        const command = {
            restaurantId: 'rest-123',
            name: 'Борщ',
            price: 150,
            isAvailable: true
        };

        // Act
        const resultId = await handler.execute(command);

        // Assert
        const savedItem = await fakeRepo.findById(resultId);
        expect(savedItem).toBeDefined();
        expect(savedItem.name).toBe('Борщ');
        expect(savedItem.price.amount).toBe(150);
        expect(savedItem.restaurantId).toBe('rest-123');
    });

    test('має викинути помилку, якщо ціна від’ємна (валідація інваріантів)', async () => {
        // Arrange
        const command = {
            restaurantId: 'rest-123',
            name: 'Борщ',
            price: -50 // Невалідна ціна для Value Object Price
        };

        // Act & Assert
        // Перевіряємо, що Handler валідує інваріанти домену 
        await expect(handler.execute(command)).rejects.toThrow();
        
        // Переконуємось, що в репозиторій нічого не було записано
        const items = await fakeRepo.findByRestaurantId('rest-123');
        expect(items.length).toBe(0);
    });
});