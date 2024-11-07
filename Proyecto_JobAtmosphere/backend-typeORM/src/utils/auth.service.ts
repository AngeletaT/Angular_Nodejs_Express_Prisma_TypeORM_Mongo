import * as jwt from 'jsonwebtoken';
import { User } from '../recruiter/recruiter.entity';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export class AuthService {
    // Método para generar el token JWT
    generateAccessToken(user: User): string {
        const secretKey = process.env.JWT_SECRET || 'SmellyCaaaaatSmellyCaaaaat';
        const expiresIn = process.env.TOKEN_EXPIRATION || '10h';

        return jwt.sign({ id: user.id, email: user.email, typeuser: "recruiter" }, secretKey, { expiresIn });
    }
}