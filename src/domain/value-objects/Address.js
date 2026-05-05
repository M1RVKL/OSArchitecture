import { InvalidAddressException } from '../exceptions/DomainError.js';

export class Address {
  /**
   * @param {Object} params
   * @param {string} params.street
   * @param {string} params.city
   * @param {string} params.flat
   */
  constructor({ street, city, flat = null }) {
    if (!street || street.trim() === '') {
      throw new InvalidAddressException('Вулиця є обов\'язковою для адреси');
    }
    if (!city || city.trim() === '') {
      throw new InvalidAddressException('Місто є обов\'язковим для адреси');
    }

    this.street = street.trim();
    this.city = city.trim();
    this.flat = flat ? String(flat).trim() : null;
    Object.freeze(this);
  }

  equals(otherAddress) {
    if (!(otherAddress instanceof Address)) {
      return false;
    }
    return (
      this.street === otherAddress.street &&
      this.city === otherAddress.city &&
      this.flat === otherAddress.flat
    );
  }

  toString() {
    let result = `${this.city}, ${this.street}`;
    if (this.flat) {
      result += `, кв. ${this.flat}`;
    }
    return result;
  }
}