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
        name?: string
    ) {
        this.limit = limit || 5;
        this.offset = offset || 0;
        this.salary_min = salary_min;
        this.salary_max = salary_max;
        this.category = category;
        this.name = name;
    }

    // Index signature to allow dynamic access
    [key: string]: any;

    // Method to count non-null/undefined properties
    public length(): number {
        let count = 0;
        if (this.salary_min) count++;
        if (this.salary_max) count++;
        if (this.category) count++;
        if (this.name) count++;
        return count;
    }

    // Method to retrieve non-null filter values dynamically
    public getFilterValues(): { [key: string]: any } {
        return Object.keys(this)
            .filter(
                (key) => this[key] !== undefined && this[key] !== null && key !== 'limit' && key !== 'offset'
            )
            .reduce((obj, key) => {
                obj[key] = this[key];
                return obj;
            }, {} as { [key: string]: any });
    }
}