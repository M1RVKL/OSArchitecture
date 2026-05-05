import prisma from '../database/prisma.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { IUserRepository } from '../../domain/ports/IUserRepository.js';

export class PrismaUserRepository extends IUserRepository {
    async save(user) {
        const data = UserMapper.toPersistence(user);
        const saved = await prisma.user.upsert({
            where: { id: data.id },
            update: data,
            create: data
        });
        return UserMapper.toDomain(saved);
    }

    async findById(id) {
        const raw = await prisma.user.findUnique({ where: { id } });
        return UserMapper.toDomain(raw);
    }

    async findByEmail(email) {
        const raw = await prisma.user.findUnique({ where: { email } });
        return UserMapper.toDomain(raw);
    }
}