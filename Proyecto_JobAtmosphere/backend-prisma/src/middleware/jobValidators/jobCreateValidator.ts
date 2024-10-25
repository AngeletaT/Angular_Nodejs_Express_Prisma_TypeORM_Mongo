import { Request, Response, NextFunction } from "express";
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import prisma from "../../utils/db/prisma";

const jobCreateValidator = [
    body('name').isString().withMessage('Job name is required'),
    body('salary').isNumeric().withMessage('Salary must be a number'),
    body('description').isString().withMessage('Description is required'),
    body('company').isString().withMessage('Company name is required')
        .custom(async (value) => {
            const company = await prisma.companies.findUnique({ where: { company_name: value } });
            if (!company) {
                throw new Error('Company name does not exist');
            }
            return true;
        }),
    body('images').isArray().withMessage('Images must be an array of strings'),
    body('img').isString().withMessage('Main image is required'),

    // Validación para el campo 'id_cat'
    body('id_cat').isString().withMessage('Category ID is required')
        .custom(async (value) => {
            const category = await prisma.categories.findFirst({ where: { id_cat: value } });
            if (!category) {
                throw new Error('Category ID does not exist');
            }
            return true;
        }),

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

export default jobCreateValidator;