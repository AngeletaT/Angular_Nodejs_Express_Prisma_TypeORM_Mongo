import prisma from "../prisma";

export default async function companyListOnePrisma(id: string) {
    const company = await prisma.companies.findUnique({
        where: { id }
    });
    return company;
}