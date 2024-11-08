import { Request, Response, NextFunction } from 'express';
import prisma from '../../utils/db/prisma';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

export default async function companyLogin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, password } = req.body;

    // console.log('Request body:', req.body);

    try {
        // Buscar la empresa por email
        const company = await prisma.companies.findUnique({
            where: {
                email: email,
            },
        });

        // console.log('Company found:', company);

        // Verificar si la empresa existe
        if (!company) {
            // console.log('Company not found');
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        // Verificar la contraseña usando argon2
        const validPassword = await argon2.verify(company.password, password);
        // console.log('Password valid:', validPassword);

        if (!validPassword) {
            // console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: company.id, email: company.email, typeuser: 'company' },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // console.log('Generated token:', token);

        // Retornar el token al cliente
        return res.status(200).json({ token });

    } catch (error) {
        console.error('Error in companyLogin:', error);
        return next(error);
    }
}