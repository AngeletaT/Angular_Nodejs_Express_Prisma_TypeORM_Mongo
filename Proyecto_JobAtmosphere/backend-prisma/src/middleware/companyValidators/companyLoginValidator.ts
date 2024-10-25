import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import prisma from '../../utils/db/prisma';
import * as argon2 from 'argon2';

const validatorLogin = [
    // Validar que el campo "email" exista y sea un email válido
    body('email').isEmail().withMessage('Invalid email')
        .custom(async (email) => {
            const company = await prisma.companies.findUnique({ where: { email } });
            if (!company) {
                throw new Error('Email does not exist');
            }
            return true;
        }),

    // Validar que el campo "password" exista
    body('password').isString().withMessage('Password is required')
        .custom(async (password, { req }) => {
            const company = await prisma.companies.findUnique({ where: { email: req.body.email } });
            if (company) {
                const isPasswordCorrect = await argon2.verify(company.password, password);
                if (!isPasswordCorrect) {
                    throw new Error('Invalid password');
                }
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

export default validatorLogin;