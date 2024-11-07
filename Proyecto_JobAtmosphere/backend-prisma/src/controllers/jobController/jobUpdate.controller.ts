import { NextFunction, Request, Response } from "express";
import { updateJob } from "../../utils/db/job/jobUpdatePrisma";
import jobViewer from "../../view/jobViewer";

export default async function jobUpdate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { slug } = req.params;
    const { name, salary, description, isActive } = req.body;
    try {
        // Llamamos a la función updateJob pasando el slug y los campos a actualizar
        const updatedJob = await updateJob(slug, { name, salary, description, isActive });

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }

        const jobView = jobViewer(updatedJob);
        return res.status(200).json({ job: jobView });

    } catch (error) {
        console.error("Controller Error:", error);
        const err = error as Error;
        return res.status(500).json({ error: "Failed to update job", details: err.message });
    }
}