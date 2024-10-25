import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const roleMiddleware = (requiredRole: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: 'Authorization header missing' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token missing' });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            const company = await prisma.companies.findUnique({
                where: { id: decoded.id }
            });

            if (!company) {
                res.status(404).json({ message: 'Company not found' });
                return;
            }

            // Verificar si la empresa tiene el rol adecuado
            if (!company.roles.includes(requiredRole)) {
                res.status(403).json({ message: `Access denied. Must have the role ${requiredRole}` });
                return;
            }

            // Almacenar la información del usuario en el request
            (req as any).company = company;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};