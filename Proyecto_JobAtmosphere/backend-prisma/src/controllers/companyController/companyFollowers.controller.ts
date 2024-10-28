import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const updateFollowers = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { increment } = req.body;  
    try {
        const updatedCompany = await prisma.companies.update({
            where: { id: companyId },
            data: {
                followers: { increment }
            }
        });
        return res.status(200).json({ company: updatedCompany });
    } catch (error) {
        console.error("Error updating followers count:", error);
        const errorMessage = (error as any).message;
        return res.status(500).json({ message: "Error updating followers count", error: errorMessage });
    }
};