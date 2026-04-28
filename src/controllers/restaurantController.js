import prisma from '../prisma.js';

export const createRestaurant = async (req, res, next) => {
    try {
        const { manager_id, name, address } = req.body;

        //перевірка обов'язкових полів (статус 400)
        if (!manager_id || !name || !address) {
            return res.status(400).json({
                error: 'Невалідні дані: manager_id, name та address є обов\'язковими'
            });
        }

        // перевірка, чи існує такий менеджер у базі
        const managerExists = await prisma.user.findUnique({
            where: { id: manager_id }
        });

        if (!managerExists) {
            return res.status(404).json({
                error: 'Користувача з таким manager_id не знайдено'
            });
        }

        // якщо всі інваріанти виконані — створюємо ресторан
        const newRestaurant = await prisma.restaurant.create({
            data: {
                manager_id,
                name,
                address
            }
        });

        res.status(201).json(newRestaurant);

    } catch (error) {
        // передаємо помилку в глобальний обробник в app.js
        next(error);
    }
};

// ------------- READ ALL (GET) отримання списку всіх активних ресторанів -------------

export const getAllRestaurants = async (req, res, next) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            where: { is_active: true }
        });
        res.status(200).json(restaurants);
    } catch (error) {
        next(error);
    }
};

// -------------- READ ONE (GET) отримання конкретного ресторану за ID --------------

export const getRestaurantById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id }
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Ресторан не знайдено' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

// ------------- UPDATE (PATCH) оновлення даних ресторану ---------------

export const updateRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address, is_active, rating, manager_id } = req.body;

        // Перевіряємо, чи існує ресторан взагалі
        const existingRestaurant = await prisma.restaurant.findUnique({ where: { id } });
        if (!existingRestaurant) {
            return res.status(404).json({ error: 'Ресторан для оновлення не знайдено' });
        }

        // --- ІНВАРІАНТИ ОНОВЛЕННЯ ---

        // 1. заборона міняти рейтинг (рейтинг має рахуватися з відгуків)
        if (rating !== undefined) {
            return res.status(400).json({ error: 'Рейтинг не можна оновлювати вручну' });
        }

        // 2. не потрібно передавати пусту назву, якщо поле name взагалі передано
        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ error: 'Назва ресторану не може бути пустою' });
        }

        // 3. зміна менеджера. Якщо її намагаються зробити, перевіряємо, чи існує новий менеджер.
        if (manager_id) {
            const managerExists = await prisma.user.findUnique({ where: { id: manager_id } });
            if (!managerExists) {
                return res.status(404).json({ error: 'Нового менеджера з таким ID не знайдено' });
            }
        }

        // Якщо всі правила виконані, оновлюємо
        const updatedRestaurant = await prisma.restaurant.update({
            where: { id },
            data: {
                name,
                address,
                is_active,
                manager_id
            }
        });

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        next(error);
    }
};

// ---------- DELETE (Soft Delete) - замість видалення з БД просто робимо неактивним --------------

export const deleteRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingRestaurant = await prisma.restaurant.findUnique({ where: { id } });
        if (!existingRestaurant) {
            return res.status(404).json({ error: 'Ресторан не знайдено' });
        }

        // Замість реального prisma.restaurant.delete() робимо soft delete
        await prisma.restaurant.update({
            where: { id },
            data: { is_active: false }
        });

        // 204 No Content - статус для успішного видалення без тіла відповіді
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};