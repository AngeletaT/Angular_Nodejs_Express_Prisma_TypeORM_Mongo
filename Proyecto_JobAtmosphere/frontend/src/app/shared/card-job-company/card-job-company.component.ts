import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-card-job-company',
  templateUrl: './card-job-company.component.html',
  styleUrls: ['./card-job-company.component.css']
})
export class CardJobCompanyComponent implements OnInit {

  @Input() job: Job = {} as Job;
  @Output() editJob = new EventEmitter<Job>();
  @Output() deactivateJob = new EventEmitter<Job>();
  @Output() activateJob = new EventEmitter<Job>();
  @Output() deleteJob = new EventEmitter<Job>();

  constructor() { }

  ngOnInit(): void {
  }

  onEditJob(job: Job) {
    this.editJob.emit(job);
  }

  onDeactivateJob(job: Job) {
    this.deactivateJob.emit(job);
  }

  onActivateJob(job: Job) {
    this.activateJob.emit(job);
  }

  onDeleteJob(job: Job) {
    this.deleteJob.emit(job);
  }
}
