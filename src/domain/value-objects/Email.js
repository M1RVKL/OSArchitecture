import { InvalidEmailException } from '../exceptions/DomainError.js';

export class Email {
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new InvalidEmailException('Email є обов\'язковим і має бути рядком');
    }

    const normalizedEmail = value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new InvalidEmailException(`Некоректний формат email: ${value}`);
    }
    
    this.value = normalizedEmail;
    Object.freeze(this);
  }

  equals(otherEmail) {
    if (!(otherEmail instanceof Email)) {
      return false;
    }
    return this.value === otherEmail.value;
  }
}