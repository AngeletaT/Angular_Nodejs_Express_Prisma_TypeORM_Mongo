import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from './recruiter.controller';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { RecruiterAssignController } from './recruiterAssign.controller';
import { updateApplicationStatus } from './recruiterApplication.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();
const recruiterAssignController = new RecruiterAssignController();

// Ruta para el login de recruiters
router.post('/recruiter/login', async (req: Request, res: Response) => {
    await userController.login(req, res);
});

// Ruta para el registro de recruiters
router.post('/recruiter/register', async (req: Request, res: Response) => {
    await userController.register(req, res);
});

// Ruta protegida con middleware de roles
router.get('/recruiter/dashboard', roleMiddleware('recruiter'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userController.getCurrentRecruiter(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Ruta para asignar un recruiter a un job
router.post('/recruiter/assign', async (req: Request, res: Response) => {
    recruiterAssignController.assignRecruiter(req, res)
});

// Ruta para actualizar el estado de una aplicación de job
router.post('/recruiter/application/status', async (req: Request, res: Response, next: NextFunction) => {
    updateApplicationStatus(req, res, next)
});

// Ruta para obtener el recruiter actual
router.get(
    "/recruiter",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userController.getCurrentRecruiter(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para obtener los jobs de un recruiter
router.get("/recruiter/job",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userController.getJobs(req, res, next);
        } catch (error) {
            next(error);
        }
    });

// Ruta para actualizar los datos de un recruiter
router.post("/recruiter/update", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userController.updateRecruiter(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;