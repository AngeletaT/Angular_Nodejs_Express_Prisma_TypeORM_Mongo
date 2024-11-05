import prisma from "../prisma";

export default async function getJobsByIds(jobIds: string[]) {
    return await prisma.jobs.findMany({
        where: { id: { in: jobIds } }
    });
}