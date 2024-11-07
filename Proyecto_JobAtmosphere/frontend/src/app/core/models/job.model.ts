export interface Job {
    id: string;
    slug: string;
    name: string;
    salary: number;
    description: string;
    company: string;
    images: string[],
    img: string,
    id_cat: string;
    favorited: boolean;
    favoritesCount: number;
    comments: [],
    application: [],
    isActive: boolean;
    recruiter: string;
}
