import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import * as e from 'express';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrls: ['./list-jobs.component.css'],
})
export class ListJobsComponent implements OnInit {
  slug_Category!: string | null;
  jobs: Job[] = [];

  constructor(
    private jobService: JobService,
    private Activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.slug_Category = this.Activatedroute.snapshot.paramMap.get('slug');
    if (this.slug_Category) {
      this.get_JobBy_Category();
    } else {
      this.get_jobs();
    }
  }

  // GET JOBS
  get_jobs(): void {
    this.jobService.get_jobs().subscribe((data: any) => {
      console.log(data);
      this.jobs = data.jobs;
    });
  }

  // GET JOB BY CATEGORY
  get_JobBy_Category(): void {
    if (this.slug_Category !== null) {
      this.jobService.getJobsByCategory(this.slug_Category).subscribe(
        (data: any) => {
          console.log('API response:', data); // Verifica la respuesta completa de la API
          if (data && data.jobs) {
            this.jobs = data.jobs;
            console.log('Jobs:', this.jobs); // Verifica los trabajos recibidos
          } else {
            console.error('No jobs found in the response');
          }
        },
        (error: any) => {
          console.error('Error fetching jobs by category:', error);
        }
      );
    }
  }
}
