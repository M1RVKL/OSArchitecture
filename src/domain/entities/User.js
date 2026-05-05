import { DomainError } from '../exceptions/DomainError.js';
import { Email } from '../value-objects/Email.js';

const VALID_ROLES = ['CUSTOMER', 'COURIER', 'MANAGER'];

export class User {
  /**
   * @param {string} id
   * @param {Email} email 
   * @param {string} name
   * @param {string} phone
   * @param {string} passwordHash
   * @param {string} role
   */
  constructor(id, email, name, phone, passwordHash, role) {
    if (!id) throw new DomainError('User ID є обов\'язковим');
    if (!(email instanceof Email)) throw new DomainError('Email має бути об\'єктом Email');
    if (!name || name.trim() === '') throw new DomainError('Ім\'я є обов\'язковим');
    if (!phone || phone.trim() === '') throw new DomainError('Телефон є обов\'язковим');
    if (!VALID_ROLES.includes(role)) throw new DomainError(`Недопустима роль користувача: ${role}`);

    this.id = id;
    this.email = email;
    this.name = name.trim();
    this.phone = phone.trim();
    this.passwordHash = passwordHash;
    this.role = role;
  }
}