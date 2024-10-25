import { Companies } from "@prisma/client";

export default function companyViewer(company: Companies) {
    const companyView = {
        id: company.id,
        username: company.username,
        company_name: company.company_name,
        email: company.email,
        location: company.location,
        n_employee: company.n_employee,
        description: company.description,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
    };
    return companyView;
}