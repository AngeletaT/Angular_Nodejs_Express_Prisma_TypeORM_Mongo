import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];  // El token suele venir en formato "Bearer <token>"

    if (!token) {
        res.status(401).json({ message: "Access token is missing or invalid" });
        return;  // Asegúrate de no retornar más allá del res.status()
    }

    try {
        const secretKey = process.env.JWT_SECRET;  // Asegúrate de tener la clave secreta configurada en el archivo .env
        const decoded = jwt.verify(token, secretKey as string);  // Verificar el token JWT

        // Usamos type assertion para asignar el usuario sin que TypeScript se queje
        (req as any).user = decoded;

        next();  // Pasar al siguiente middleware si la autenticación es correcta
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
        return;  // Evitar retorno adicional
    }
};

export default authMiddleware;