// src/utils/orderUtils.js
export const calculateTotalPrice = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const validateAvailability = (items) => {
    // Повертає список недоступних страв
    return items.filter(item => !item.isAvailable);
};