export interface Recruiter {
  id: string;
  email: string;
  username: string;
  password: string;
  roles: string[];
  busy?: boolean;
  jobs?: string[];
}