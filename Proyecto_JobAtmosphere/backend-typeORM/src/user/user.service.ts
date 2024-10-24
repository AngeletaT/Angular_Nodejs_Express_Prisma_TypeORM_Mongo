import { getRepository } from 'typeorm';
import { User } from './user.entity';
import { IUser } from './user.interface';
import * as argon2 from 'argon2';

export class UserService {
    // Crear un nuevo usuario
    async createUser(userData: IUser): Promise<User> {
        const userRepository = getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User();
        user.email = userData.email;
        user.username = userData.username;
        user.password = userData.password;
        user.roles = userData.roles || ['recruiter'];
        user.busy = false;


        await user.hashPassword();
        await userRepository.save(user);

        return user;
    }

    // Buscar usuario por email
    async findUserByEmail(email: string): Promise<User | null> {
        const userRepository = getRepository(User);
        return await userRepository.findOne({ where: { email } });
    }

    // Validar la contraseña
    async validatePassword(user: User, password: string): Promise<boolean> {
        return await user.validatePassword(password);
    }
}