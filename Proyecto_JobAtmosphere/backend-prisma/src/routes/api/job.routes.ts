import { Router, Request, Response, NextFunction } from "express";
import jobCreate from "../../controllers/jobController/jobCreate.controller";
import assignRecruiter from "../../controllers/jobController/assignRecruiter.controller";
import validatorCreate from "../../middleware/jobValidators/jobCreateValidator";
import authMiddleware from "../../middleware/authMiddleware"
import updateJob from "../../controllers/jobController/jobUpdate.controller";

const router = Router();

// Ruta para crear un job
router.post(
    "/jobs", 
    authMiddleware,  
    validatorCreate, 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await jobCreate(req, res, next);  
        } catch (error) {
            next(error);  
        }
    }
);

// Nueva ruta para intentar asignar un recruiter usando el slug
router.post(
    "/job/:slug/assign", 
    authMiddleware,  
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await assignRecruiter(req, res, next);  
        } catch (error) {
            next(error);  
        }
    }
);

// Nueva ruta para actualizar un job
router.put(
    "/job/:slug", 
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await updateJob(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;