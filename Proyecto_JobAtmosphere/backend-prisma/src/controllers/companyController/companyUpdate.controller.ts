import { Request, Response, NextFunction } from "express";
import updateCompanyPrisma from "../../utils/db/company/companyUpdatePrisma";
import companyViewer from "../../view/companyViewer";


export default async function updateCompany(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const companyId = (req as any).user.id;
    const { location, n_employee, description } = req.body;
    try {
        // Llamamos a la función updateCompany pasando el id y los campos a actualizar
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