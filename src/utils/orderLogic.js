// src/utils/orderLogic.js

// Перевірка на порожнє замовлення
export const isOrderEmpty = (items) => !items || items.length === 0;

// Розрахунок загальної ціни
export const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Логіка скасування
export const canCancelOrder = (status) => {
    return ['CREATED', 'ACCEPTED'].includes(status);
};

// Логіка призначення кур'єра
export const validateCourierAssignment = (status, currentCourierId, newCourierId) => {
    if (!['PREPARING', 'READY'].includes(status)) {
        return { allowed: false, error: 'Замовлення недоступне для кур\'єра' };
    }
    if (currentCourierId && currentCourierId !== newCourierId) {
        return { allowed: false, error: 'Замовлення вже прийняте іншим кур\'єром' };
    }
    return { allowed: true };
};