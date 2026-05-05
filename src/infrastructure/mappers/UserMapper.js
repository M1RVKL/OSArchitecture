import { User } from '../../domain/entities/User.js';
import { Email } from '../../domain/value-objects/Email.js';

export class UserMapper {
    static toDomain(raw) {
        if (!raw) return null;
        return new User(
            raw.id,
            new Email(raw.email),
            raw.name,
            raw.phone,
            raw.password_hash,
            raw.role
        );
    }

    static toPersistence(domainUser) {
        return {
            id: domainUser.id,
            email: domainUser.email.value,
            name: domainUser.name,
            phone: domainUser.phone,
            password_hash: domainUser.passwordHash,
            role: domainUser.role,
        };
    }
}