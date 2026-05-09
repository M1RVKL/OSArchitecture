import { CreateRestaurantCommand } from '../../application/commands/CreateRestaurantCommand.js';
import { CreateRestaurantCommandHandler } from '../../application/handlers/command-handlers/CreateRestaurantCommandHandler.js';
import { DeactivateRestaurantCommand } from '../../application/commands/DeactivateRestaurantCommand.js';
import { DeactivateRestaurantCommandHandler } from '../../application/handlers/command-handlers/DeactivateRestaurantCommandHandler.js';
import { GetActiveRestaurantsQuery } from '../../application/queries/GetActiveRestaurantsQuery.js';
import { GetActiveRestaurantsQueryHandler } from '../../application/handlers/query-handlers/GetActiveRestaurantsQueryHandler.js';
import { GetRestaurantByIdQuery } from '../../application/queries/GetRestaurantByIdQuery.js';
import { GetRestaurantByIdQueryHandler } from '../../application/handlers/query-handlers/GetRestaurantByIdQueryHandler.js';
import { PrismaRestaurantRepository } from '../../infrastructure/repositories/PrismaRestaurantRepository.js';

const restaurantRepo = new PrismaRestaurantRepository();
const createRestaurantHandler = new CreateRestaurantCommandHandler(restaurantRepo);
const deactivateRestaurantHandler = new DeactivateRestaurantCommandHandler(restaurantRepo);
const getActiveRestaurantsHandler = new GetActiveRestaurantsQueryHandler(); 
const getRestaurantByIdHandler = new GetRestaurantByIdQueryHandler();

export const createRestaurant = async (req, res, next) => {
    try {
        const command = new CreateRestaurantCommand({
            managerId: req.body.manager_id,
            name: req.body.name,
            address: req.body.address
        });
        
        const restaurantId = await createRestaurantHandler.execute(command);
        res.status(201).json({ id: restaurantId });
    } catch (error) { next(error); }
};

export const deleteRestaurant = async (req, res, next) => {
    try {
        const command = new DeactivateRestaurantCommand({
            restaurantId: req.params.id
        });

        await deactivateRestaurantHandler.execute(command);
        res.status(204).send();
    } catch (error) { next(error); }
};

export const getAllRestaurants = async (req, res, next) => {
    try {
        const query = new GetActiveRestaurantsQuery({});
        const result = await getActiveRestaurantsHandler.execute(query);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

export const getRestaurantById = async (req, res, next) => {
    try {
        const query = new GetRestaurantByIdQuery({ restaurantId: req.params.id });
        const result = await getRestaurantByIdHandler.execute(query);
        res.status(200).json(result);
    } catch (error) { next(error); }
};