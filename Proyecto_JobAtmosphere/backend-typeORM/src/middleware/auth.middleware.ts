import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access token is missing or invalid" });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secretKey) as { email: string };

        // Usamos type assertion para asignar `email` a `req` temporalmente
        (req as Request & { email: string }).email = decoded.email;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;