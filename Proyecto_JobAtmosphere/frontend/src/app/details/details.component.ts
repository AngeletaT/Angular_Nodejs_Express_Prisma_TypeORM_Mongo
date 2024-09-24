import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Job } from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgControlStatusGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  job!: Job;
  slug!: string | null;
  constructor(
    private JobService: JobService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router
  ) // private ToastrService: ToastrService,
  {}
  ngOnInit(): void {
    this.slug = this.ActivatedRoute.snapshot.paramMap.get('slug');
    console.log(this.slug);
    this.get_job();
  }
  get_job() {
    if (typeof this.slug === 'string') {
      this.JobService.get_job(this.slug).subscribe((data: any) => {
        this.job = data.jobs;
        console.log(this.job);
      });
    } else {
      console.log('fallo al encontrar el job');
      this.router.navigate(['/']);
    }
  }
}
