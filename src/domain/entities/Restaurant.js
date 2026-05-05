import { DomainError } from '../exceptions/DomainError.js';
import { Address } from '../value-objects/Address.js';

export class Restaurant {
  /**
   * @param {string} id
   * @param {string} name
   * @param {Address} address
   * @param {boolean} isActive
   */
  constructor(id, name, address, isActive = true) {
    if (!id || !name || name.trim() === '') {
      throw new DomainError('Ресторан повинен мати ID та назву');
    }
    if (!(address instanceof Address)) {
      throw new DomainError('Адреса ресторану має бути об\'єктом Address');
    }

    this.id = id;
    this.name = name.trim();
    this.address = address;
    this.isActive = isActive;
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }
}