export interface Recruiter {
  user: {
    id: string;
    email: string;
    username: string;
    password: string;
    image: string;
    roles: string[];
    busy?: boolean;
    jobs?: string[];
  }
}