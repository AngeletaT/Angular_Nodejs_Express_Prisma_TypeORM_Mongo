import { Request, Response, NextFunction } from 'express';
import prisma from '../../utils/db/prisma';  // Asegúrate de que el path a Prisma sea correcto
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

export default async function companyLogin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, password } = req.body;

    try {
        // Buscar la empresa por email
        const company = await prisma.companies.findUnique({
            where: {
                email: email,
            },
        });

        // Verificar si la empresa existe
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Verificar la contraseña usando argon2
        const validPassword = await argon2.verify(company.password, password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: company.id, roles: company.roles },
            process.env.JWT_SECRET as string,  // Usa tu clave secreta para firmar el JWT
            { expiresIn: '1h' }
        );

        // Retornar el token al cliente
        return res.status(200).json({ token });

    } catch (error) {
        return next(error);
    }
}