import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const roleMiddleware = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
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
            const decoded = jwt.verify(token, 'SECRET_KEY') as any;
            const userRoles = decoded.roles;

            // Verificamos si el usuario tiene el rol requerido
            if (!userRoles.includes(requiredRole)) {
                res.status(403).json({ message: `Access denied. Must be ${requiredRole}` });
                return;
            }

            (req as any).user = decoded;
            next();  // Continuamos con el siguiente middleware o ruta
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};