import { Request, Response, NextFunction } from "express";
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import prisma from "../../utils/db/prisma";

const validatorCreate = [
    body('username').isString().withMessage('Username is required')
        .custom(async (value) => {
            const user = await prisma.companies.findUnique({ where: { username: value } });
            if (user) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    body('company_name').isString().withMessage('Company name is required')
        .custom(async (value) => {
            const company = await prisma.companies.findUnique({ where: { company_name: value } });
            if (company) {
                throw new Error('Company name already exists');
            }
            return true;
        }),
    body('password').isString().withMessage('Password is required'),
    body('email').isEmail().withMessage('Invalid email')
        .custom(async (value) => {
            const email = await prisma.companies.findUnique({ where: { email: value } });
            if (email) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('location').optional().isString().withMessage('Location must be a string'),
    body('n_employee').isInt({ min: 1 }).withMessage('Number of employees must be an integer greater than 0'),
    body('description').optional().isString().withMessage('Description must be a string'),

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

export default validatorCreate;