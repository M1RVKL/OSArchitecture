import { CreateRestaurantCommandHandler } from '../../../src/application/handlers/command-handlers/CreateRestaurantCommandHandler.js';
import { FakeRestaurantRepository } from '../../../src/infrastructure/database/fakes/FakeRestaurantRepository.js';

describe('CreateRestaurantCommandHandler (Unit with Fake)', () => {
    let fakeRepo;
    let handler;

    beforeEach(() => {
        fakeRepo = new FakeRestaurantRepository();
        handler = new CreateRestaurantCommandHandler(fakeRepo);
    });

    test('має успішно створити ресторан та зберегти його у Fake репозиторій', async () => {
        const command = {
            name: 'Pizzeria Romana',
            address: { 
                city: 'Kyiv', 
                street: 'Shevchenka', 
                flat: '10' 
            }
        };

        const resultId = await handler.execute(command);

        const savedRestaurant = await fakeRepo.findById(resultId);
        
        expect(resultId).toBeDefined();
        expect(savedRestaurant).toBeDefined();
        expect(savedRestaurant.name).toBe('Pizzeria Romana');
        expect(savedRestaurant.address.city).toBe('Kyiv');
    });

    test('має викинути помилку, якщо інваріанти адреси порушені', async () => {
        const command = {
            name: 'Invalid Rest',
            address: { city: 'Kyiv' } 
        };

        await expect(handler.execute(command)).rejects.toThrow();
        
        const active = await fakeRepo.findAllActive();
        expect(active.length).toBe(0);
    });
});