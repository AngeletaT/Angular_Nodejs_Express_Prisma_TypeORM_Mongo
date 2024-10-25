import * as jwt from 'jsonwebtoken';
import { User } from '../recruiter/recruiter.entity';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export class AuthService {
    // Método para generar el token JWT
    generateAccessToken(user: User): string {
        const secretKey = process.env.ACCESS_TOKEN_SECRET || 'maytheforcebewithyou';
        const expiresIn = process.env.TOKEN_EXPIRATION || '1h';

        return jwt.sign({ id: user.id, roles: user.roles }, secretKey, { expiresIn });
    }

    // Aquí podrías añadir más lógica relacionada con autenticación, como validar tokens, etc.
}