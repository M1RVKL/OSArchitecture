import crypto from 'crypto';
import { User } from '../entities/User.js';
import { Email } from '../value-objects/Email.js';
import { DomainError } from '../exceptions/DomainError.js';

export class UserFactory {
  /**
   * @param {import('../ports/IUserRepository.js').IUserRepository} userRepository
   */
  constructor(userRepository) {
    if (!userRepository) {
      throw new Error('UserFactory вимагає userRepository');
    }
    this.userRepository = userRepository;
  }

  /**
   * Створює нового користувача після перевірки бізнес-правил
   * @param {string} emailStr 
   * @param {string} name
   * @param {string} phone
   * @param {string} passwordHash 
   * @param {string} role 
   * @returns {Promise<User>}
   */
  async createNewUser(emailStr, name, phone, passwordHash, role) {
    const emailVO = new Email(emailStr);
    const existingUser = await this.userRepository.findByEmail(emailVO.value);
    if (existingUser) {
      throw new DomainError(`Користувач з email ${emailVO.value} вже існує в системі`);
    }

    const newId = crypto.randomUUID();
    return new User(newId, emailVO, name, phone, passwordHash, role);
  }
}