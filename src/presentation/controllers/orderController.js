import { CreateOrderUseCase } from '../../application/use-cases/CreateOrderUseCase.js';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/UpdateOrderStatusUseCase.js';
import { PrismaOrderRepository } from '../../infrastructure/repositories/PrismaOrderRepository.js';
import { PrismaRestaurantRepository } from '../../infrastructure/repositories/PrismaRestaurantRepository.js';
import { PrismaMenuRepository } from '../../infrastructure/repositories/PrismaMenuRepository.js';
import { OrderFactory } from '../../domain/factories/OrderFactory.js';

const restaurantRepo = new PrismaRestaurantRepository();
const orderRepo = new PrismaOrderRepository();
const menuRepo = new PrismaMenuRepository();
const orderFactory = new OrderFactory(restaurantRepo);
const createOrderUseCase = new CreateOrderUseCase(orderFactory, orderRepo, menuRepo);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepo);

export const createOrder = async (req, res, next) => {
    try {
        const dto = {
            customerId: req.user.userId,
            restaurantId: req.body.restaurant_id,
            deliveryAddress: req.body.delivery_address,
            items: req.body.items
        };

        const result = await createOrderUseCase.execute(dto);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { action } = req.body;

        const courierId = action === 'assign_courier' ? req.user.userId : null;

        const result = await updateOrderStatusUseCase.execute({
            orderId: id,
            action: action,
            courierId: courierId
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};