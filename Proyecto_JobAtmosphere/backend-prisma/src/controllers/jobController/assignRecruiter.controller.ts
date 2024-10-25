import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/db/prisma";
import axios from "axios";

/**
 * Controlador para asignar un recruiter a un job usando el slug.
 * @param req Request de Express
 * @param res Response de Express
 * @param next NextFunction para manejo de errores
 */
export default async function assignRecruiter(
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<Response | void> {
    const { slug } = req.params;

    try {
        // Buscar el job por el slug
        const job = await prisma.jobs.findUnique({
            where: { slug }
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Verificar si el job ya está activo
        if (job.isActive) {
            return res.status(400).json({ message: "Job is already active" });
        }

        // Intentar asignar un recruiter
        const recruiterResponse = await axios.post("http://localhost:3002/recruiter/assign", {
            jobId: job.id
        });

        const { recruiterAssigned, recruiterId } = recruiterResponse.data;  // Incluimos recruiterId en la respuesta

        if (recruiterAssigned && recruiterId) {
            // Si se asigna un recruiter, activar el job y actualizar el recruiterId
            await prisma.jobs.update({
                where: { id: job.id },
                data: { 
                    isActive: true,
                    recruiter: recruiterId  // Actualizar el recruiter en el job
                }
            });

            return res.status(200).json({ message: "Recruiter assigned and job activated", recruiterId });
        } else {
            return res.status(200).json({ message: "No recruiter available, job remains inactive" });
        }

    } catch (error) {
        next(error);  // Pasamos el error al middleware de manejo de errores
    }
}