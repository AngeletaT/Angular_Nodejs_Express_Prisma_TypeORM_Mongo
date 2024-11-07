import { Component, OnInit } from '@angular/core';
import { RecruiterService } from '../core/services/recruiter.service';
import { Recruiter } from '../core/models/recruiter.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css'],
})
export class RecruiterDashboardComponent implements OnInit {

  recruiter: any = {} as Recruiter;
  currentView: string = 'dashboard';


  constructor(private recruiterService: RecruiterService) { }

  ngOnInit(): void {
    // Cargar todos los datos de la empresa
    this.recruiterService.getRecruiterProfile().subscribe({
      next: (recruiter: any) => {
        this.recruiter = recruiter.user;
        console.log("Se cargaron los datos del recruiter", recruiter);
      },
      error: (err: any) => {
        console.log("Error al cargar los datos de la empresa", err);
      },
    });
  }

  showDashboard() {
    this.currentView = 'dashboard';
  }

  showJobs() {
    this.currentView = 'jobs';
  }

  showSettings() {
    this.currentView = 'settings';
  }

  isActive(view: string): boolean {
    return this.currentView === view;
  }
}
