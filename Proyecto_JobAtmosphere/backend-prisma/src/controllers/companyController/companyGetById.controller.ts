import { NextFunction, Request, Response } from "express";
import companyListOnePrisma from "../../utils/db/company/companyListOnePrisma";
import companyViewer from "../../view/companyViewer";

export default async function companyGetById(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {
        const company = await companyListOnePrisma(req);
        
        if (!company) return res.sendStatus(404);

        const companyView = companyViewer(company);
        return res.status(200).json({ company: companyView });
    } catch (error) {
        return next(error);
    }
}