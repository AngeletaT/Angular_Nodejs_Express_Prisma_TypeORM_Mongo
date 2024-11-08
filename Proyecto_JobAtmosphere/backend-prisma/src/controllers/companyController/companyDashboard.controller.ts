import { Request, Response, NextFunction } from 'express';
import companyListOnePrisma from '../../utils/db/company/companyListOnePrisma';

export const companyDashboard = async (req: Request, res: Response) => {
    try {
        // Obtener el email del JWT decodificado (se almacena en `req.email` después del middleware de autenticación)
        const email = (req as Request & { email: string }).email;
        // console.log('Email de la empresa obtenido del token:', email);

        if (!email) {
            return res.status(400).json({ message: 'No se proporcionó un email de empresa válido.' });
        }

        // Obtener los datos de la empresa
        // console.log('Realizando consulta a la base de datos...');
        const company = await companyListOnePrisma(req);

        // console.log('Resultado de la consulta a la base de datos:', company);

        if (!company) {
            console.error('Empresa no encontrada.');
            return res.status(404).json({ message: 'Empresa no encontrada.' });
        }

        // Devolver la información del perfil de la empresa
        return res.status(200).json({ company });
    } catch (error) {
        console.error('Error al obtener los datos de la empresa:', error);
        return res.status(500).json({ message: 'Error al obtener los datos de la empresa.' });
    }
};
