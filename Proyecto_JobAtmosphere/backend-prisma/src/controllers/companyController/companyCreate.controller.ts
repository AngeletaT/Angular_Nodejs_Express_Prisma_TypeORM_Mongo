import { NextFunction, Request, Response } from "express";
import companyCreatePrisma from "../../utils/db/company/companyCreatePrisma";
import companyViewer from "../../view/companyViewer";

/**
 * Company controller to create a new company.
 * @param req Request with company data in the body
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function companyCreate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { username, company_name, password, email, location, n_employee, description } = req.body;

    try {
        const newCompany = await companyCreatePrisma({
            username,
            company_name,
            password,
            email,
            location,
            n_employee,
            description
        });

        const companyView = companyViewer(newCompany);
        return res.status(201).json({ company: companyView });
    } catch (error) {
        return next(error);
    }
}