import { Request, Response, NextFunction } from "express";
import updateCompanyPrisma from "../../utils/db/company/companyUpdatePrisma";
import companyViewer from "../../view/companyViewer";

export default async function updateCompany(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const companyId = (req as any).user?.id;
        if (!companyId) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const { location, n_employee, description } = req.body;
        const updatedCompany = await updateCompanyPrisma(companyId, { location, n_employee, description });

        if (!updatedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        const companyView = companyViewer(updatedCompany);
        return res.status(200).json({ company: companyView });

    } catch (error) {
        return next(error);
    }
}