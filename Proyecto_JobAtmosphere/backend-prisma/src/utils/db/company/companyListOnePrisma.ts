import prisma from "../prisma";
import { Request } from "express";

export default async function companyListOnePrisma(req: Request) {
    const userEmail = (req as Request & { email: string }).email;

    const result = await prisma.companies.findFirst({
        where: { email: userEmail }
    });

    return result;
}