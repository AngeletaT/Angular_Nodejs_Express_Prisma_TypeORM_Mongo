import { Companies } from "@prisma/client";

export default function companyViewer(company: Companies) {
    const companyView = {
        id: company.id,
        username: company.username,
        company_name: company.company_name,
        email: company.email,
        location: company.location,
        image: company.image,
        n_employee: company.n_employee,
        description: company.description,
        followers: company.followers,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        jobs: company.jobs,
    };
    return companyView;
}