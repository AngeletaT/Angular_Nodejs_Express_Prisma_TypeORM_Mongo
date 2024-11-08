import { Request, Response, NextFunction } from "express";
import getJobsByIds from "../../utils/db/job/getJobsByIdsPrisma";
import jobViewer from "../../view/jobViewer";
import prisma from "../../utils/db/prisma";

export default async function getCompanyJobs(req: Request, res: Response, next: NextFunction) {
    try {
        const companyEmail = (req as any).user.email;
        // console.log("Fetching company jobs...");
        const company = await prisma.companies.findUnique({
            where: { email: companyEmail },
            select: { jobs: true }
        });
    
        if (!company) {
            // console.log("Company not found.");
            return res.status(404).json({ message: "Company not found." });
        }
    
        // console.log("Company jobs:", company.jobs);
    
        const jobs = await getJobsByIds(company.jobs);
        const jobsView = jobs.map(job => jobViewer(job));
    
        // console.log("Jobs View:", jobsView);
        return res.status(200).json({ jobs: jobsView });
    } catch (error) {
        console.error("Error in getCompanyJobs:", error);
        next(error);
    }
}