import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-card-application',
  templateUrl: './card-application.component.html',
  styleUrls: ['./card-application.component.css']
})
export class CardApplicationComponent implements OnInit {

  @Input() job: any;
  @Output() editInscriptions = new EventEmitter<Job>();

  constructor() { }

  ngOnInit(): void {
  }

  onEditInscriptions(job: Job) {
    this.editInscriptions.emit(job);
  }
}
