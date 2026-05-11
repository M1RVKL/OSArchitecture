import { Price } from '../../../src/domain/value-objects/Price.js';
import { jest } from '@jest/globals';
import { CreateOrderCommandHandler } from '../../../src/application/handlers/command-handlers/CreateOrderCommandHandler.js';
import { FakeOrderRepository } from '../../../src/infrastructure/database/fakes/FakeOrderRepository.js';
import { FakeMenuRepository } from '../../../src/infrastructure/database/fakes/FakeMenuRepository.js';

describe('CreateOrderCommandHandler (Unit with Fakes)', () => {
    let handler;
    let orderRepo;
    let menuRepo;
    let mockOrderFactory;

    beforeEach(() => {
        orderRepo = new FakeOrderRepository();
        menuRepo = new FakeMenuRepository();
        
        mockOrderFactory = {
            createNewOrder: jest.fn().mockResolvedValue({
                id: 'generated-order-id',
                customerId: 'user-1',
                items: [],
                addItem(item) { this.items.push(item); }
            })
        };

        handler = new CreateOrderCommandHandler(mockOrderFactory, orderRepo, menuRepo);
    });

    test('має успішно створити замовлення та зберегти його у FakeOrderRepository', async () => {
        const menuItem = { 
            id: 'pizza-123', 
            name: 'Маргарита', 
            price: new Price(250), 
            isAvailable: true 
        };
        await menuRepo.save(menuItem);

        const command = {
            customerId: 'user-1',
            restaurantId: 'rest-1',
            deliveryAddress: { city: 'Kyiv', street: 'Polytechnic' },
            items: [{ menuItemId: 'pizza-123', 
                quantity: 2 }]
        };

        const resultId = await handler.execute(command);

        const savedOrder = await orderRepo.findById(resultId);
        
        expect(resultId).toBe('generated-order-id');
        expect(savedOrder).toBeDefined();
        expect(savedOrder.items.length).toBe(1);
        expect(savedOrder.items[0].productId).toBe('pizza-123');
        expect(mockOrderFactory.createNewOrder).toHaveBeenCalledWith(
            command.customerId,
            command.restaurantId,
            command.deliveryAddress
        );
    });

    test('має викинути помилку, якщо страва позначена як недоступна', async () => {
        await menuRepo.save({ id: 'sushi-1', name: 'Суші', isAvailable: false });

        const command = {
            customerId: 'user-1',
            restaurantId: 'rest-1',
            items: [{ menuItemId: 'sushi-1', quantity: 1 }]
        };

        await expect(handler.execute(command)).rejects.toThrow('Страва sushi-1 недоступна');
        
        expect(orderRepo.orders.size).toBe(0);
    });
});