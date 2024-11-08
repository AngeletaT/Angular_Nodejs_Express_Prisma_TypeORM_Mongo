import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extiende Request para incluir user en el tipo
interface AuthenticatedRequest extends Request {
    user?: {
        email: string;
    };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token: ", token);

    if (!token) {
        res.status(401).json({ message: "Access token is missing or invalid" });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secretKey) as { email: string };

        // Guarda el email en `req.user`
        req.user = { email: decoded.email };

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;