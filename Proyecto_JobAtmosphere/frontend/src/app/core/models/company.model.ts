export interface Company {
  id: string;
  username: string;
  company_name: string;
  password: string;
  email: string;
  location?: string;
  n_employee: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  v?: number;
  followers: string[];
  jobs: string[];
  roles: string[];
}