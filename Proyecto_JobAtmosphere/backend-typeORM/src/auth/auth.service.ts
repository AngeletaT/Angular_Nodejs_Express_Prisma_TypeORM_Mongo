import * as jwt from 'jsonwebtoken';
import { User } from '../user/user.entity';

export class AuthService {
    // Método para generar el token JWT
    generateAccessToken(user: User): string {
        return jwt.sign({ id: user.id, roles: user.roles }, 'SECRET_KEY', { expiresIn: '1h' });
    }

    // Aquí podrías añadir más lógica relacionada con autenticación, como validar tokens, etc.
}