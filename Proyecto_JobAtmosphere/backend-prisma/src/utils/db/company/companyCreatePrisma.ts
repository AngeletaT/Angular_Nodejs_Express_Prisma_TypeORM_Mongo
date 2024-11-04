import prisma from "../prisma";
import * as argon2 from 'argon2';  // Importamos argon2

interface CompanyData {
    username: string;
    company_name: string;
    password: string;
    email: string;
    location?: string;
    image?: string;
    n_employee: number;
    description?: string;
}

export default async function companyCreatePrisma(data: CompanyData) {
    // Encriptar la contraseña usando Argon2
    const hashedPassword = await argon2.hash(data.password);

    const newCompany = await prisma.companies.create({
        data: {
            username: data.username,
            company_name: data.company_name,
            password: hashedPassword,  // Guardar la contraseña encriptada
            email: data.email,
            location: data.location ?? '',  // Proveer un valor por defecto
            image: data.image ?? '',        // Proveer un valor por defecto
            n_employee: data.n_employee,
            description: data.description ?? '',  // Proveer un valor por defecto
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: ["company"],  // Asignar el rol de 'company' al crear la empresa
            followers: 0  // Inicializar followers como 0
        }
    });

    return newCompany;
}