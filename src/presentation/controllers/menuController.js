import { CreateMenuItemCommand } from '../../application/commands/CreateMenuItemCommand.js';
import { CreateMenuItemCommandHandler } from '../../application/handlers/command-handlers/CreateMenuItemCommandHandler.js';
import { ToggleMenuItemCommand } from '../../application/commands/ToggleMenuItemCommand.js';
import { ToggleMenuItemCommandHandler } from '../../application/handlers/command-handlers/ToggleMenuItemCommandHandler.js';
import { GetMenuForRestaurantQuery } from '../../application/queries/GetMenuForRestaurantQuery.js';
import { GetMenuForRestaurantQueryHandler } from '../../application/handlers/query-handlers/GetMenuForRestaurantQueryHandler.js'
import { PrismaMenuRepository } from '../../infrastructure/repositories/PrismaMenuRepository.js';

const menuRepo = new PrismaMenuRepository();
const createMenuItemHandler = new CreateMenuItemCommandHandler(menuRepo);
const toggleAvailabilityHandler = new ToggleMenuItemAvailabilityCommandHandler(menuRepo);
const getMenuHandler = new GetMenuForRestaurantQueryHandler();

export const createMenuItem = async (req, res, next) => {
    try {
        const command = new CreateMenuItemCommand({
            restaurantId: req.body.restaurantId,
            name: req.body.name,
            price: req.body.price,
            isAvailable: req.body.isAvailable
        });

        const menuItemId = await createMenuItemHandler.execute(command);
        res.status(201).json({ id: menuItemId });
    } catch (error) { next(error); }
};

export const updateMenuItem = async (req, res, next) => {
    try {
        const command = new ToggleMenuItemCommand({
            menuItemId: req.params.id,
            isAvailable: req.body.is_available
        });

        await toggleAvailabilityHandler.execute(command);
        res.status(200).json({ message: 'Статус доступності змінено' });
    } catch (error) { next(error); }
};

export const getMenuByRestaurant = async (req, res, next) => {
    try {
        const query = new GetMenuForRestaurantQuery({ restaurantId: req.params.restaurantId });
        const result = await getMenuHandler.execute(query);
        res.status(200).json(result);
    } catch (error) { next(error); }
};