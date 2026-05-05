import { DomainError } from '../exceptions/DomainError.js';
import { Price } from '../value-objects/Price.js';

export class OrderItem {
  /**
   * @param {string} productId
   * @param {string} name
   * @param {number} quantity
   * @param {Price} unitPrice
   */
  constructor(productId, name, quantity, unitPrice) {
    if (!productId || !name || name.trim() === '') {
      throw new DomainError('Позиція замовлення повинна мати ID та назву');
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new DomainError('Кількість має бути більше 0');
    }
    if (!(unitPrice instanceof Price)) {
      throw new DomainError('Ціна має бути об\'єктом Price');
    }

    this.productId = productId;
    this.name = name.trim();
    this.quantity = quantity;
    this.unitPrice = unitPrice; 
  }

  /**
   * Рахує загальну вартість цієї позиції
   * @returns {Price}
   */
  getTotalPrice() {
    return new Price(this.unitPrice.amount * this.quantity);
  }
}