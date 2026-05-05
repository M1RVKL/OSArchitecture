export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidOrderStatusException extends DomainError {}
export class InvalidEmailException extends DomainError {}
export class InvalidPriceException extends DomainError {}
export class InvalidAdressException extends DomainError {}