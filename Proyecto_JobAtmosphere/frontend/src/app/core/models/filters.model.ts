export class Filters {
  limit?: number;
  offset?: number;
  salary_min?: number;
  salary_max?: number;
  category?: string;
  name?: string;
  
  constructor(
      limit?: number,
      offset?: number,
      salary_min?: number,
      salary_max?: number,
      category?: string,
      name?: string,
  ) 
  {
      this.limit = limit || 5;
      this.offset = offset || 0;
      this.salary_min = salary_min;
      this.salary_max = salary_max;
      this.category = category;
      this.name = name;
  }

  public length(): number {
      let count: number = 0;
      if (this.salary_min) count++;
      if (this.salary_max) count++;
      if (this.category) count++;
      if (this.name) count++;
      return count;
  }
}