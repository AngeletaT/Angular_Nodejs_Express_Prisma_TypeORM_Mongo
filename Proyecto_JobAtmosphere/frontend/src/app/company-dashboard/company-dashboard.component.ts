import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../core/services/company.service';
import { Company } from '../core/models/company.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.css'],
})
export class CompanyDashboardComponent implements OnInit {
  currentView: string = 'dashboard';
  company: any = {} as Company;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    // Cargar todos los datos de la empresa
    this.companyService.getCompanyProfile().subscribe({
      next: (company) => {
        this.company = company;
        console.log("Se cargaron los datos de la empresa", company);
      },
      error: (err) => {
        console.log("Error al cargar los datos de la empresa", err);
      },
    });
  }

  // Método para crear un nuevo trabajo
  createJob() {
    
  }

  // Método para solicitar un reclutador si un trabajo no tiene uno asignado
  requestRecruiter(jobSlug: string) {
    this.companyService.requestRecruiter(jobSlug).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'Se ha enviado una solicitud para asignar un reclutador a este trabajo.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo solicitar un reclutador. Inténtelo de nuevo.',
        });
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
