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
    recruiter: string;
}

export default async function jobCreatePrisma(data: JobData) {

    const slug = `${data.name.toLowerCase().replace(/ /g, '-')}-${Math.random().toString(36).substr(2, 9)}`;

    const newJob = await prisma.jobs.create({
        data: {
            name: data.name,
            salary: data.salary,
            description: data.description,
            company: data.company,
            images: data.images,
            img: data.img,
            id_cat: data.id_cat,
            isActive: false,
            recruiter: '',
            slug,
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

        const { recruiterAssigned, recruiterId } = recruiterResponse.data;

        if (recruiterAssigned && recruiterId) {
            // Si se asigna un recruiter, activar el job y actualizar el campo recruiter
            await prisma.jobs.update({
                where: { id: newJob.id },
                data: { 
                    isActive: true,
                    recruiter: recruiterId  // Añadir el ID del recruiter asignado
                }
            });
        }

        // Actualizar la categoría añadiendo el id del nuevo job
        const category = await prisma.categories.findFirst({
            where: { id_cat: data.id_cat }
        });

        if (!category) {
            throw new Error(`Category with id_cat ${data.id_cat} not found`);
        }

        await prisma.categories.update({
            where: { id: category.id },
            data: {
                jobs: {
                    push: newJob.id
                }
            }
        });
        // Actualizar el array de jobs en la compañía
        await prisma.companies.update({
            where: { company_name: data.company },
            data: {
                jobs: {
                    push: newJob.id
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