import { RestaurantService } from '../../application/use-cases/RestaurantService.js';
import { PrismaRestaurantRepository } from '../../infrastructure/repositories/PrismaRestaurantRepository.js';

const restaurantRepo = new PrismaRestaurantRepository();
const restaurantService = new RestaurantService(restaurantRepo);

export const createRestaurant = async (req, res, next) => {
    try {
        const dto = {
            managerId: req.body.manager_id,
            name: req.body.name,
            address: req.body.address
        };
        const result = await restaurantService.createRestaurant(dto);
        res.status(201).json(result);
    } catch (error) { next(error); }
};

export const getAllRestaurants = async (req, res, next) => {
    try {
        const result = await restaurantService.getAllActive();
        res.status(200).json(result);
    } catch (error) { next(error); }
};

export const getRestaurantById = async (req, res, next) => {
    try {
        const result = await restaurantService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

export const deleteRestaurant = async (req, res, next) => {
    try {
        await restaurantService.deactivateRestaurant(req.params.id);
        res.status(204).send();
    } catch (error) { next(error); }
};