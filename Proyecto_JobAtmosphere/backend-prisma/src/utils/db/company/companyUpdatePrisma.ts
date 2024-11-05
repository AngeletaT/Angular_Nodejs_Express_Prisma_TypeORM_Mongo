import prisma from "../prisma";
import { Companies } from "@prisma/client";

export default async function updateCompany(
    email: string, // Cambiamos `id` por `email`
    data: { location?: string; image?: string; n_employee?: number; description?: string }
): Promise<Companies | null> {
    try {
        const updatedCompany = await prisma.companies.update({
            where: { email }, // Buscamos por `email`
            data: {
                location: data.location,
                image: data.image,
                n_employee: data.n_employee,
                description: data.description,
                updatedAt: new Date()
            }
        });

        return updatedCompany;

    } catch (error) {
        console.error("Error updating company:", error);
        throw new Error("Failed to update company.");
    }
}