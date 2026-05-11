import bcrypt from 'bcryptjs';

export class RegisterUserCommandHandler {
    constructor(userFactory, userRepository) {
        this.userFactory = userFactory;
        this.userRepository = userRepository;
    }

    async execute(command) {
        if (!command.password) {
            throw new Error('Пароль є обов’язковим');
        }

        const passwordHash = await bcrypt.hash(command.password, 10);
        const user = await this.userFactory.createNewUser(
            command.email, 
            command.name, 
            command.phone, 
            passwordHash, 
            command.role
        );

        await this.userRepository.save(user);

        return user.id;
    }
}