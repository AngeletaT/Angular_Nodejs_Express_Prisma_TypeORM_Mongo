import prisma from "../prisma";
import { Jobs } from "@prisma/client";

export async function updateJob(
    slug: string,
    data: { name?: string; salary?: number; description?: string; isActive?: boolean }

): Promise<Jobs | null> {
    try {
        const updatedJob = await prisma.jobs.update({
            where: { slug },
            data: {
                name: data.name,
                salary: data.salary,
                description: data.description,
                isActive: data.isActive
            }
        });
        return updatedJob;

    } catch (error) {
        console.error("Detailed Error:", error);
        throw error;
    }
}