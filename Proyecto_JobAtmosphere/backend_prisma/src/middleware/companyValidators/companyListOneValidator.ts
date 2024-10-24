import { Request, Response, NextFunction } from "express";
import { param } from 'express-validator';
import { validationResult } from 'express-validator';

const validatorList = [
    param('id').isMongoId().withMessage('Invalid company ID'),

    // Middleware para manejar los errores de validación
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }
];

export default validatorList;