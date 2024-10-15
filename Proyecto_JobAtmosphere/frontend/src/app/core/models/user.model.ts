import { Job } from "./job.model";

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
  favoriteJobs: Job[];
  following: [];
}