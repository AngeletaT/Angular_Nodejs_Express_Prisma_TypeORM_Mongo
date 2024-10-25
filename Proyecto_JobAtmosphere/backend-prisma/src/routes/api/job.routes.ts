import { Router, Request, Response, NextFunction } from "express";
import jobCreate from "../../controllers/jobController/jobCreate.controller";
import assignRecruiter from "../../controllers/jobController/assignRecruiter.controller";
import validatorCreate from "../../middleware/jobValidators/jobCreateValidator";
import authMiddleware from "../../middleware/authMiddleware";  // Importar el middleware de autenticación

const router = Router();

// Ruta para crear un job
router.post(
    "/jobs", 
    authMiddleware,  // Añadir el middleware de autenticación
    validatorCreate, 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await jobCreate(req, res, next);  // Asegurarnos de que el controlador sea asíncrono y manejado correctamente
        } catch (error) {
            next(error);  // Pasar el error al middleware de manejo de errores
        }
    }
);

// Nueva ruta para intentar asignar un recruiter usando el slug
router.post(
    "/job/:slug/assign", 
    authMiddleware,  // Middleware de autenticación
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await assignRecruiter(req, res, next);  // Llamamos al nuevo controlador
        } catch (error) {
            next(error);  // Manejo de errores
        }
    }
);

export default router;