export interface Company {
  id: string;
  username: string;
  company_name: string;
  password: string;
  email: string;
  location?: string;
  image?: string;
  n_employee: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  v?: number;
  followed: boolean;
  followers: number;
  jobs: string[];
  roles: string[];
}