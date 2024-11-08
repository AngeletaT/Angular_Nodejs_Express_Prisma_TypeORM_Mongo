import { Component, OnInit } from '@angular/core';
import { RecruiterService } from '../core/services/recruiter.service';
import { Recruiter } from '../core/models/recruiter.model';
import { Job } from '../core/models/job.model';
import Swal from 'sweetalert2';
import { JobService } from '../core/services/job.service';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css'],
})
export class RecruiterDashboardComponent implements OnInit {

  recruiter: any;
  currentView: string = 'dashboard';
  myJobs: Job[] = [];
  totalApplications: number = 0;
  user: User[] = [];
  selectedJobApplications: any[] = []; // Cambia a any[] para almacenar objetos personalizados

  constructor(private recruiterService: RecruiterService, private userService: UserService) { }

  ngOnInit(): void {
    this.recruiterService.getRecruiterProfile().subscribe({
      next: (recruiter: any) => {
        this.recruiter = recruiter.user;
        this.loadApplications();
      },
      error: (err: any) => {
        // console.log("Error al cargar los datos de la empresa", err);
      },
    });
  }

  showDashboard(): void {
    this.currentView = 'dashboard';
  }

  showJobs(): void {
    this.currentView = 'applications';
  }

  showSettings(): void {
    this.currentView = 'settings';
  }

  isActive(view: string): boolean {
    return this.currentView === view;
  }

  loadApplications() {
    this.recruiterService.getJobApplications().subscribe({
      next: (applications) => {
        this.totalApplications = applications.jobs.reduce((total: number, jobWrapper: any) => {
          const job = jobWrapper.job;
          return total + job.application.length;
        }, 0);
        this.myJobs = applications.jobs.map((jobWrapper: any) => jobWrapper.job);
      },
      error: (err) => {
        console.error('Error al cargar las aplicaciones del trabajo:', err);
      }
    });
  }

  editStatus(job: Job): void {
    this.showCandidates(job);
  }

  showCandidates(job: Job): void {
    this.currentView = 'candidates';
    this.selectedJobApplications = [];

    const userRequests = job.application.map((application: any) => {
      return this.userService.getUserById(application.userId).pipe(
        map((user: any) => ({
          user: user,
          status: application.status,
          jobId: job.id
        }))
      );
    });

    forkJoin(userRequests).subscribe({
      next: (applications: any[]) => {
        this.selectedJobApplications = applications;
        // console.log("Candidatos:", this.selectedJobApplications);
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
      }
    });
  }
}
