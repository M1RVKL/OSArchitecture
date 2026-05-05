export const isOrderEmpty = (items) => !items || items.length === 0;

export const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const canCancelOrder = (status) => {
    return ['CREATED', 'ACCEPTED'].includes(status);
};

export const validateCourierAssignment = (status, currentCourierId, newCourierId) => {
    if (!['PREPARING', 'READY'].includes(status)) {
        return { allowed: false, error: 'Замовлення недоступне для кур\'єра' };
    }
    if (currentCourierId && currentCourierId !== newCourierId) {
        return { allowed: false, error: 'Замовлення вже прийняте іншим кур\'єром' };
    }
    return { allowed: true };
};