import { Request, Response, NextFunction } from 'express';  // Agregamos NextFunction
import { getRepository } from 'typeorm';
import { User } from './user.entity';

export class RecruiterAssignController {
    // Asignar un job a un recruiter disponible (busy: false)
    async assignRecruiter(req: Request, res: Response, next: NextFunction): Promise<Response | void> {  
        const { jobId } = req.body;

        try {
            const userRepository = getRepository(User);

            // Buscar un recruiter disponible (busy: false)
            const recruiter = await userRepository.findOne({ where: { busy: false, roles: 'recruiter' } });

            if (!recruiter) {
                // Si no hay recruiters disponibles, devolver inmediatamente
                return res.status(200).json({ recruiterAssigned: false });
            }

            // Marcar el recruiter como ocupado y asignarle el job
            recruiter.busy = true;

            // Verificamos si 'jobs' existe, si no, inicializamos el array
            recruiter.jobs = recruiter.jobs ? [...recruiter.jobs, jobId] : [jobId];  

            // Guardar el recruiter actualizado
            await userRepository.save(recruiter);

            return res.status(200).json({ recruiterAssigned: true });

        } catch (error) {
            next(error);  // Pasamos el error a Express para su manejo
        }
    }
}