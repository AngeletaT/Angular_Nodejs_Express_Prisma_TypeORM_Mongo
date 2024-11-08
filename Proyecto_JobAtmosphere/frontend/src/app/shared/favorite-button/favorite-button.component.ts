import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { Job } from '../../core/models/job.model';
import { JobService } from 'src/app/core/services/job.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.css']
})
export class FavoriteButtonComponent implements OnInit {

  @Input() jobs: Job = {} as Job;
  @Output() toggle = new EventEmitter<boolean>();

  isSubmitting = false;
  isLoged: Boolean = false;

  constructor(
    private UserService: UserService,
    private JobService: JobService,
    private Router: Router,
  ) { }

  ngOnInit(): void { }

  toggleFavorite() {
    this.isSubmitting = true;
    this.UserService.isAuthenticated.subscribe({
      next: data => this.isLoged = data,
    });

    if (!this.isLoged) {
      setTimeout(() => { this.Router.navigate(['/login']); }, 600);
    } else {

      if (!this.jobs.favorited) {
        this.JobService.favorite(this.jobs.slug as String).subscribe({
          next: data => {
            // console.log(data);
            this.jobs.favorited = true;
            this.isSubmitting = false;
            this.toggle.emit(true);
          },
        });
      } else {
        this.JobService.unfavorite(this.jobs.slug as String).subscribe({
          next: data => {
            // console.log(data);
            this.jobs.favorited = false;
            this.isSubmitting = false;
            this.toggle.emit(false);
          },
        });
      }
    }
  }
}
