import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from './recruiter.entity';

export class RecruiterAssignController {
    // Asignar un job a un recruiter disponible (busy: false)
    async assignRecruiter(req: Request, res: Response): Promise<Response | void> {  // Cambiamos el tipo de retorno
        const { jobId } = req.body;

        try {
            const userRepository = getRepository(User);

            // Buscar un recruiter disponible (busy: false)
            const recruiter = await userRepository.findOne({ where: { busy: false, roles: 'recruiter' } });

            if (!recruiter) {
                // Si no hay recruiters disponibles
                return res.status(200).json({ recruiterAssigned: false });
            }

            // Marcar el recruiter como ocupado y asignarle el job
            recruiter.busy = true;
            recruiter.jobs = recruiter.jobs ? [...recruiter.jobs, jobId] : [jobId];
            await userRepository.save(recruiter);

            // Devolver el recruiterId en la respuesta
            return res.status(200).json({ recruiterAssigned: true, recruiterId: recruiter.id });
        } catch (error) {
            return res.status(500).json({ message: 'Error assigning recruiter', error: (error as Error).message });
        }
    }
}