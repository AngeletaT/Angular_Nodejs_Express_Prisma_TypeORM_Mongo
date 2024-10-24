import { NextFunction, Request, Response } from "express";
import jobCreatePrisma from "../../utils/db/job/jobCreatePrisma";
import jobViewer from "../../view/jobViewer";

/**
 * Job controller to create a new job.
 * @param req Request with job data in the body
 * @param res Response
 * @param next NextFunction
 * @returns void
 */
export default async function jobCreate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, salary, description, company, images, img, id_cat } = req.body;

    try {
        const newJob = await jobCreatePrisma({
            name,
            salary,
            description,
            company,
            images,
            img,
            id_cat
        });

        const jobView = jobViewer(newJob);
        return res.status(201).json({ job: jobView });
    } catch (error) {
        return next(error);
    }
}