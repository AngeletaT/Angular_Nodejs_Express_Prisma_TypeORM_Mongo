import { Jobs } from "@prisma/client";

export default function jobViewer(job: Jobs) {
    return {
        id: job.id,
        name: job.name,
        salary: job.salary,
        description: job.description,
        company: job.company,
        images: job.images,
        img: job.img,
        id_cat: job.id_cat,
        slug: job.slug,
        favoritesCount: job.favoritesCount,
        comments: job.comments
    };
}