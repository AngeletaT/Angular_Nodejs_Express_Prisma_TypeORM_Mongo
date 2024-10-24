import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { RecruiterAssignController } from './recruiterAssign.controller';

const router = Router();
const userController = new UserController();
const recruiterAssignController = new RecruiterAssignController();  // Instanciamos la clase

// Ruta para el registro de usuarios
router.post('/register', async (req: Request, res: Response) => {
    await userController.register(req, res);  // Llamamos al controlador
});

// Ruta para el login de usuarios
router.post('/login', async (req: Request, res: Response) => {
    await userController.login(req, res);  // Llamamos al controlador
});

// Ruta protegida con middleware de roles
router.get('/test', roleMiddleware('recruiter'), (req, res) => {
    res.json({ message: 'Welcome, recruiter!' });
});

// Ruta para asignar un recruiter a un job
router.post('/assign', async (req: Request, res: Response, next: NextFunction) => {
    recruiterAssignController.assignRecruiter(req, res, next)
});

export default router;