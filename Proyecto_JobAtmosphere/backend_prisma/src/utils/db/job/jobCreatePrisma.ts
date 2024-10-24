import prisma from "../prisma";
import axios from 'axios';

interface JobData {
    name: string;
    salary: number;
    description: string;
    company: string;
    images: string[];
    img: string;
    id_cat: string;
    isActive?: boolean;
}

export default async function jobCreatePrisma(data: JobData) {
    const newJob = await prisma.jobs.create({
        data: {
            name: data.name,
            salary: data.salary,
            description: data.description,
            company: data.company,
            images: data.images,
            img: data.img,
            id_cat: data.id_cat,
            isActive: false,  // Comienza como inactivo
            slug: `${data.name.toLowerCase().replace(/ /g, '-')}-${Math.random().toString(36).substr(2, 9)}`,
            favoritesCount: 0,
            comments: [],
            v: 0
        }
    });

    try {
        // Intentar asignar un recruiter al nuevo job usando Axios
        const recruiterResponse = await axios.post('http://localhost:3002/recruiter/assign', {
            jobId: newJob.id
        });

        const { recruiterAssigned } = recruiterResponse.data;

        if (recruiterAssigned) {
            // Si se asigna un recruiter, activar el job
            await prisma.jobs.update({
                where: { id: newJob.id },
                data: { isActive: true }
            });
        }

        // Buscar la categoría con id_cat antes de actualizar
        const category = await prisma.categories.findFirst({
            where: { id_cat: data.id_cat }
        });

        if (!category) {
            throw new Error(`Category with id_cat ${data.id_cat} not found`);
        }

        // Actualizar la categoría añadiendo el id del nuevo job
        await prisma.categories.update({
            where: { id: category.id },  // Usamos el id único de la categoría
            data: {
                jobs: {
                    push: newJob.id // Agregar el id del nuevo job al array de jobs
                }
            }
        });

        return newJob;

    } catch (error) {
        // Si algo falla, hacemos rollback eliminando el job creado
        await prisma.jobs.delete({ where: { id: newJob.id } });
        if (error instanceof Error) {
            throw new Error(`Error during job creation or recruiter assignment: ${error.message}`);
        } else {
            throw new Error('Error during job creation or recruiter assignment: Unknown error');
        }
    }
}