import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// Controlador para actualizar el estado de una aplicación
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { jobId, userId, newStatus } = req.body;

    try {
        // Aquí deberías incluir el token JWT
        const token = req.headers.authorization?.split(' ')[1];  // Extrae el token de las cabeceras de la solicitud

        if (!token) {
            return res.status(401).json({ message: "Access token is missing or invalid" });
        }

        // Orquestación con Axios - Notificar al servidor de Mongoose
        const response = await axios.put('http://localhost:3000/user/application/status', {
            jobId,
            userId,
            newStatus
        }, {
            headers: {
                Authorization: `Bearer ${token}`  // Añadir el token en el encabezado de la solicitud a Mongoose
            }
        });

        return res.status(200).json({
            message: "Application status updated successfully",
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({ message: "Error in application status orchestration", error: (error as any).message });
    }
};