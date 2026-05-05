import { InvalidPriceException } from '../exceptions/DomainError.js';

export class Price {
  constructor(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new InvalidPriceException('Ціна має бути коректним числом');
    }
    if (amount < 0) {
      throw new InvalidPriceException(`Ціна не може бути від'ємною. Передано: ${amount}`);
    }

    this.amount = amount;
    Object.freeze(this);
  }

  add(otherPrice) {
    if (!(otherPrice instanceof Price)) {
      throw new InvalidPriceException('Додавати можна лише інші об\'єкти Price');
    }
    return new Price(this.amount + otherPrice.amount);
  }

  equals(otherPrice) {
    if (!(otherPrice instanceof Price)) {
      return false;
    }
    return this.amount === otherPrice.amount;
  }
}