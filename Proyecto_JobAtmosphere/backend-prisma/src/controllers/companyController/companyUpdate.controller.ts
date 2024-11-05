import { Request, Response, NextFunction } from "express";
import updateCompanyPrisma from "../../utils/db/company/companyUpdatePrisma";
import companyViewer from "../../view/companyViewer";

// Extiende Request para incluir user en el tipo
interface AuthenticatedRequest extends Request {
    user?: {
        email: string;
    };
}

export default async function updateCompany(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const companyEmail = req.user?.email;
        const { location, n_employee, image, description } = req.body;

        if (!companyEmail) {
            return res.status(401).json({ message: "Unauthorized: Email missing" });
        }

        const updatedCompany = await updateCompanyPrisma(companyEmail, { location, n_employee, image, description });

        if (!updatedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }

        const companyView = companyViewer(updatedCompany);
        return res.status(200).json({ company: companyView });

    } catch (error) {
        return next(error);
    }
}