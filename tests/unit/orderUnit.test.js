import { canCancelOrder, validateCourierAssignment, calculateTotal } from '../../src/utils/orderLogic.js';

describe('Unit Test: Order Logic', () => {
    
    test('canCancelOrder: має дозволяти скасування для CREATED', () => {
        expect(canCancelOrder('CREATED')).toBe(true);
    });

    test('canCancelOrder: має забороняти скасування для DELIVERING', () => {
        expect(canCancelOrder('DELIVERING')).toBe(false);
    });

    test('validateCourierAssignment: має дозволяти для PREPARING', () => {
        const result = validateCourierAssignment('PREPARING', null, 'courier_1');
        expect(result.allowed).toBe(true);
    });

    test('validateCourierAssignment: має забороняти, якщо кур\'єр вже є', () => {
        const result = validateCourierAssignment('PREPARING', 'courier_OLD', 'courier_NEW');
        expect(result.allowed).toBe(false);
        expect(result.error).toMatch(/вже прийняте/);
    });

    test('calculateTotal: має правильно рахувати ціну', () => {
        const items = [{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }];
        expect(calculateTotal(items)).toBe(250);
    });
});