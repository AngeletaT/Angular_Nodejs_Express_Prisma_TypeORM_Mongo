import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Job } from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { UserService } from '../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../core/models/comment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  job!: Job;
  slug!: string | null;
  selectedComment: Comment | null = null;
  isApplying: boolean = false; // Nueva propiedad

  constructor(
    private JobService: JobService,
    private UserService: UserService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.slug = this.ActivatedRoute.snapshot.paramMap.get('slug');
    // console.log(this.slug);
    this.get_job();
  }

  get_job() {
    if (typeof this.slug === 'string') {
      this.JobService.get_job(this.slug).subscribe((data: any) => {
        this.job = data.jobs;
        // console.log(this.job);
      });
    } else {
      // console.log('fallo al encontrar el job');
      this.router.navigate(['/']);
    }
  }

  applyForJob() {
    // console.log('Applying for job', this.job.id);
    if (this.job && this.job.id) {
      this.isApplying = true;
      this.UserService.applyForJob(this.job.id).subscribe(
        (response) => {
          // console.log('Application successful', response);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'You have successfully applied for the job.',
          });
        },
        (error) => {
          console.error('Application failed', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'An error occurred while applying for the job.',
          });
          this.isApplying = false;
        }
      );
    }
  }

  onToggleFavorite(favorited: boolean) {
    this.job.favorited = favorited;

    if (favorited) {
      this.job.favoritesCount++;
    } else {
      this.job.favoritesCount--;
    }
  }

  onEditComment(comment: Comment) {
    this.selectedComment = comment;
  }

  onSubmitComment() {
    this.selectedComment = null;
  }

  convertCompanyNameToUrl(companyName: string): string {
    return companyName.replace(/\s+/g, '-');
  }
}
