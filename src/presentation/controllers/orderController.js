import { CreateOrderCommand } from '../../application/commands/CreateOrderCommand.js';
import { CreateOrderCommandHandler } from '../../application/handlers/command-handlers/CreateOrderCommandHandler.js';
import { UpdateOrderStatusCommand } from '../../application/commands/UpdateOrderStatusCommand.js';
import { UpdateOrderStatusCommandHandler } from '../../application/handlers/command-handlers/UpdateOrderStatusCommandHandler.js';
import { OrderFactory } from '../../domain/factories/OrderFactory.js';
import { PrismaOrderRepository } from '../../infrastructure/repositories/PrismaOrderRepository.js';
import { PrismaRestaurantRepository } from '../../infrastructure/repositories/PrismaRestaurantRepository.js';
import { PrismaMenuRepository } from '../../infrastructure/repositories/PrismaMenuRepository.js';
import { GetOrderByIdQuery } from '../../application/queries/GetOrderByIdQuery.js';
import { GetOrderByIdQueryHandler } from '../../application/handlers/query-handlers/GetOrderByIdQueryHandler.js';

const restaurantRepo = new PrismaRestaurantRepository();
const orderRepo = new PrismaOrderRepository();
const menuRepo = new PrismaMenuRepository();
const orderFactory = new OrderFactory(restaurantRepo);
const createOrderHandler = new CreateOrderCommandHandler(orderFactory, orderRepo, menuRepo);
const updateOrderStatusHandler = new UpdateOrderStatusCommandHandler(orderRepo);
const getOrderByIdHandler = new GetOrderByIdQueryHandler();

export const createOrder = async (req, res, next) => {
    try {
        const command = new CreateOrderCommand({
            customerId: req.user.userId,
            restaurantId: req.body.restaurant_id,
            deliveryAddress: req.body.delivery_address,
            items: req.body.items
        });

        const orderId = await createOrderHandler.execute(command);
        res.status(201).json({ id: orderId, message: 'Замовлення створено' });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const action = req.body.action;
        const courierId = action === 'assign_courier' ? req.user.userId : null;

        const command = new UpdateOrderStatusCommand({
            orderId: req.params.id,
            action: action,
            courierId: courierId
        });

        await updateOrderStatusHandler.execute(command);
        res.status(200).json({ message: 'Статус замовлення успішно оновлено' });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const query = new GetOrderByIdQuery({ orderId: req.params.id });
        const result = await getOrderByIdHandler.execute(query);
        res.status(200).json(result);
    } catch (error) { next(error); }
};