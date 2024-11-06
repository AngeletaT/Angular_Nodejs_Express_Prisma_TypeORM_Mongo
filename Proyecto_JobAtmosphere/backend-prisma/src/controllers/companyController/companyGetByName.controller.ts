import { NextFunction, Request, Response } from "express";
import companyGetByNamePrisma from "../../utils/db/company/companyGetByNamePrisma";
import companyViewer from "../../view/companyViewer";

export default async function companyGetByName(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const company = await companyGetByNamePrisma(req);
        if (!company) return res.sendStatus(404);

        const companyView = companyViewer(company);
        return res.status(200).json({ company: companyView });
    } catch (error) {
        return next(error);
    }
}