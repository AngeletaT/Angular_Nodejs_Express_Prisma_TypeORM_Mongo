import { Job } from './job.model';

export interface Category {
  slug: string;
  id_cat: string;
  category_name: string;
  image: string;
  job: string[];
}
