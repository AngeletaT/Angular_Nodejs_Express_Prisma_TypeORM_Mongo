import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { Filters } from 'src/app/core/models/filters.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrls: ['./list-jobs.component.css'],
})
export class ListJobsComponent implements OnInit {
  slug_Category!: string | null;
  @Input() jobs: Job[] = [];
  routeFilters!: string | null;
  listCategories: Category[] = [];
  filters = new Filters();
  offset: number = 0;
  limit: number = 5;
  totalPages: Array<number> = [];
  currentPage: number = 1;

  constructor(
    private jobService: JobService,
    private ActivatedRoute: ActivatedRoute,
    private CategoryService: CategoryService,
    private Location: Location
  ) { }

  ngOnInit(): void {
    if (!this.jobs.length) {
      this.slug_Category = this.ActivatedRoute.snapshot.paramMap.get('slug');
      this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');

      this.getListForCategory();

      if (this.slug_Category !== null) {
        this.get_JobBy_Category();
      } else if (this.routeFilters !== null) {
        this.refreshRouteFilter();
        this.get_list_filtered(this.filters);
      } else {
        this.get_jobs();
      }
    }
  }

  // GET JOBS
  get_jobs(): void {
    this.jobService.get_jobs().subscribe((data: any) => {
      // console.log(data);
      this.jobs = data.jobs;
      this.totalPages = Array.from(
        new Array(Math.ceil(data.Job_count / this.limit)),
        (val, index) => index + 1
      );
    });
  }

  // GET JOB BY CATEGORY
  get_JobBy_Category(): void {
    if (this.slug_Category !== null) {
      this.jobService.getJobsByCategory(this.slug_Category).subscribe(
        (data: any) => {
          this.jobs = data.jobs;
          this.totalPages = Array.from(
            new Array(Math.ceil(data.Job_count / this.limit)),
            (val, index) => index + 1
          );
        },
        (error: any) => {
          console.error('Error fetching jobs by category:', error);
        }
      );
    }
  }

  get_list_filtered(filters: Filters) {
    this.filters = filters;
    this.jobService.get_jobs_filter(filters).subscribe((data: any) => {
      // console.log(data.jobs);
      this.jobs = data.jobs;
      this.totalPages = Array.from(
        new Array(Math.ceil(data.Job_count / this.limit)),
        (val, index) => index + 1
      );
    });
  }

  getListForCategory() {
    this.CategoryService.all_categories_select().subscribe((data: any) => {
      this.listCategories = data.categories;
    });
  }

  refreshRouteFilter() {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    if (typeof this.routeFilters == 'string') {
      this.filters = JSON.parse(atob(this.routeFilters));
    } else {
      this.filters = new Filters();
    }
  }

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;

    if (typeof this.routeFilters === 'string') {
      this.refreshRouteFilter();
    }

    if (this.limit) {
      this.filters.limit = this.limit;
      this.filters.offset = this.limit * (this.currentPage - 1);
    }

    this.Location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));
    this.get_list_filtered(this.filters);
  }
}
