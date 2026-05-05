import { DomainError, InvalidOrderStatusException } from '../exceptions/DomainError.js';
import { Address } from '../value-objects/Address.js';
import { Price } from '../value-objects/Price.js';
import { OrderItem } from './OrderItem.js';

export class Order {
  /**
   * @param {Object} params
   * @param {string} params.id 
   * @param {string} params.customerId
   * @param {string} params.restaurantId
   * @param {Address} params.deliveryAddress
   * @param {string} [params.status] 
   * @param {OrderItem[]} [params.items]
   * @param {string|null} [params.courierId]
   */
  constructor({ id, customerId, restaurantId, deliveryAddress, status = 'CREATED', items = [], courierId = null }) {
    if (!id || !customerId || !restaurantId) {
      throw new DomainError('Замовлення повинно мати ID, Customer ID та Restaurant ID');
    }
    if (!(deliveryAddress instanceof Address)) {
      throw new DomainError('deliveryAddress має бути об\'єктом Address');
    }

    this.id = id;
    this.customerId = customerId;
    this.restaurantId = restaurantId;
    this.deliveryAddress = deliveryAddress;
    this.status = status;
    this.items = items;
    this.courierId = courierId;
  }

  /**
   * Додає страву до замовлення
   * @param {OrderItem} item 
   */
  addItem(item) {
    if (this.status !== 'CREATED') {
      throw new DomainError('Не можна додавати страви до вже оформленого замовлення');
    }
    if (!(item instanceof OrderItem)) {
      throw new DomainError('Можна додавати тільки об\'єкти OrderItem');
    }
    this.items.push(item);
  }

  /**
   * Розрахунок загальної суми замовлення
   * @returns {Price}
   */
  calculateTotalAmount() {
    let total = 0;
    for (const item of this.items) {
      total += item.getTotalPrice().amount;
    }
    return new Price(total);
  }

  // --- Машина станів ---

  acceptByRestaurant() {
    if (this.status !== 'CREATED') {
      throw new InvalidOrderStatusException('Ресторан може прийняти тільки нове (CREATED) замовлення');
    }
    this.status = 'ACCEPTED';
  }

  markAsReady() {
    if (this.status !== 'ACCEPTED') {
      throw new InvalidOrderStatusException('Замовлення можна зробити READY тільки після ACCEPTED');
    }
    this.status = 'READY';
  }

  assignCourier(courierId) {
    if (!['ACCEPTED', 'READY'].includes(this.status)) {
      throw new InvalidOrderStatusException('Кур\'єра можна призначити лише для прийнятого або готового замовлення');
    }
    if (this.courierId) {
      throw new DomainError('Кур\'єр вже призначений на це замовлення');
    }
    this.courierId = courierId;
  }

  startDelivery() {
    if (this.status !== 'READY') {
      throw new InvalidOrderStatusException('Доставляти можна тільки готове замовлення');
    }
    if (!this.courierId) {
      throw new DomainError('Неможливо почати доставку без призначеного кур\'єра');
    }
    this.status = 'DELIVERING';
  }

  completeDelivery() {
    if (this.status !== 'DELIVERING') {
      throw new InvalidOrderStatusException('Завершити можна тільки замовлення, що знаходиться в дорозі');
    }
    this.status = 'DELIVERED';
  }

  cancel() {
    if (['DELIVERING', 'DELIVERED', 'CANCELLED'].includes(this.status)) {
      throw new InvalidOrderStatusException('Це замовлення вже неможливо скасувати');
    }
    this.status = 'CANCELLED';
  }
}