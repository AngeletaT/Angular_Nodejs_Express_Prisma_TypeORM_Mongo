import prisma from "../prisma";
import { Request } from "express";

export default async function companyGetByName(req: Request) {
    const company_name = req.body;

    const result = await prisma.companies.findFirst({
        where: { company_name: company_name }
    });

    return result;
}