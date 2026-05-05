import { MenuService } from '../../application/use-cases/MenuService.js';
import { PrismaMenuRepository } from '../../infrastructure/repositories/PrismaMenuRepository.js';

const menuRepo = new PrismaMenuRepository();
const menuService = new MenuService(menuRepo);

export const createMenuItem = async (req, res, next) => {
    try {
        const result = await menuService.createMenuItem(req.body);
        res.status(201).json(result);
    } catch (error) { next(error); }
};

export const getMenuByRestaurant = async (req, res, next) => {
    try {
        const result = await menuService.getMenuForRestaurant(req.params.restaurantId);
        res.status(200).json(result);
    } catch (error) { next(error); }
};

export const updateMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { is_available } = req.body;
        const result = await menuService.toggleAvailability(id, is_available);
        res.status(200).json(result);
    } catch (error) { next(error); }
};