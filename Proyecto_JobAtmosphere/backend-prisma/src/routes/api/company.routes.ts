import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import companyGetById from '../../controllers/companyController/companyGetById.controller';
import companyCreate from '../../controllers/companyController/companyCreate.controller';
import validatorListOne from '../../middleware/companyValidators/companyListOneValidator';
import validatorCreate from '../../middleware/companyValidators/companyCreateValidator';
import { roleMiddleware } from '../../middleware/companyValidators/RoleMiddleware';
import companyLogin from "../../controllers/companyController/companyLogin.controller";
import validatorLogin from "../../middleware/companyValidators/companyLoginValidator";

const router = Router();

router.get("/company/:id", validatorListOne, (req: Request, res: Response, next: NextFunction) => {
    companyGetById(req, res, next);
});
router.post("/register", validatorCreate, (req: Request, res: Response, next: NextFunction) => {
    companyCreate(req, res, next);
});
router.get('/dashboard', roleMiddleware('company'), (req, res) => {
    res.json({ message: 'Welcome to the company dashboard' });
});
router.post('/login', validatorLogin, (req: Request, res: Response, next: NextFunction) => {
    companyLogin(req, res, next);
});

export default router;