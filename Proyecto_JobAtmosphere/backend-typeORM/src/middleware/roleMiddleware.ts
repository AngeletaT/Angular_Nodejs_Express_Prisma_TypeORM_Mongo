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
            const secretKey = process.env.JWT_SECRET as string;
            const decoded = jwt.verify(token, secretKey) as any;
            const userType = decoded.typeuser;

            // Verificamos si el usuario tiene el rol requerido
            if (userType !== requiredRole) {
                res.status(403).json({ message: `Access denied. Must be ${requiredRole}` });
                return;
            }

            (req as Request & { email: string }).email = decoded.email;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};