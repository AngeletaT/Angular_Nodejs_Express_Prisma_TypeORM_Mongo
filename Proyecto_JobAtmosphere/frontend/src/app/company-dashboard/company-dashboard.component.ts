import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../core/services/company.service';
import { Company } from '../core/models/company.model';
import Swal from 'sweetalert2';
import { Job } from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { CategoryService } from '../core/services/category.service';
import { Category } from '../core/models/category.model';
import { response } from 'express';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.css'],
})
export class CompanyDashboardComponent implements OnInit {
  currentView: string = 'dashboard';
  company: any = {} as Company;
  myJobs: Job[] = [];
  totalCandidates: number = 0;
  newJob: Job = {} as Job;
  selectedJob: Job = {} as Job;
  listCategories: Category[] = [];
  selectedCategory: string = '';
  imagesString: string = '';


  constructor(private companyService: CompanyService, private jobService: JobService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    // Cargar todos los datos de la empresa
    this.companyService.getCompanyProfile().subscribe({
      next: (company) => {
        this.company = company;
        // console.log("Se cargaron los datos de la empresa", company);
      },
      error: (err) => {
        // console.log("Error al cargar los datos de la empresa", err);
      },
    });

    this.loadCompanyJobs();
  }

  // Método para crear un nuevo trabajo
  loadCompanyJobs(): void {
    this.companyService.getCompanyJobs().subscribe({
      next: (jobs) => {
        this.myJobs = jobs;
        this.totalCandidates = jobs.reduce((total, job) => total + (job.application ? job.application.length : 0), 0);
      },
      error: (err) => {
        console.error('Error al cargar los trabajos de la empresa:', err);
      }
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

  showFormEditJob() {
    this.currentView = 'edit-job';
  }

  isActive(view: string): boolean {
    return this.currentView === view;
  }

  // Crear un nuevo trabajo
  addNewJob() {
    this.currentView = 'create-job';
    this.getListForCategory();
  }

  cancelJob() {
    this.currentView = 'jobs';
  }

  submitNewJob() {
    // console.log('Nuevo trabajo:', this.newJob);
    this.newJob.images = this.imagesString.split(',').map(image => image.trim());
    this.newJob.company = this.company.company_name;
    this.newJob.img = this.company.image;
    this.jobService.create_job(this.newJob).subscribe({
      next: () => {
        // console.log('Trabajo creado');
        this.loadCompanyJobs();
        this.showJobs();
      },
      error: (err) => {
        console.error('Error al crear el trabajo:', err);
      }
    });
  }

  // Editar un trabajo
  editJob(job: Job) {
    this.selectedJob = job;
    this.currentView = 'edit-job';
  }

  submitEditJob() {
    this.jobService.update_job(this.selectedJob, this.selectedJob.slug).subscribe({
      next: () => {
        // console.log('Trabajo actualizado');
        this.loadCompanyJobs();
        this.showJobs();
      },
      error: (err) => {
        console.error('Error al actualizar el trabajo:', err);
      }
    });
  }

  // Desactivar un trabajo
  deactivateJob(job: Job) {
    // console.log('Desactivar trabajo:', job);
    // Llama al servicio para desactivar el trabajo
    if (job.recruiter === '') {
      job.isActive = false;
      // console.log('Trabajo desactivado');
      this.jobService.update_job(job, job.slug).subscribe({
        next: () => {
          this.loadCompanyJobs();
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No puedes desactivar un trabajo que tiene un proceso de seleccion en curso',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Activar un trabajo
  activateJob(job: Job) {
    // console.log('Activar trabajo:', job);
    this.jobService.requestRecruiter(job.slug).subscribe({
      next: (response) => {
        // console.log('response:', response);
        if (response.message.startsWith('No')) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo asignar un reclutador',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Éxito',
            text: 'Reclutador asignado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          // console.log('Recruiter assigned');
          this.loadCompanyJobs();
        }
      },
      error: (err) => {
        console.error('Error al asignar un reclutador:', err);
      }
    });
  }

  // Eliminar un trabajo
  deleteJob(job: Job) {
    // console.log('Eliminar trabajo:', job);
  }

  getListForCategory() {
    this.categoryService.all_categories_select().subscribe((data: any) => {
      this.listCategories = data.categories;
      // console.log('Listado de categorías:', this.listCategories);
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    // console.log('Selected category:', this.selectedCategory);
  }

}
