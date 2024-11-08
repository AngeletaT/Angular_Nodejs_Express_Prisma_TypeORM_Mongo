import { Component, OnInit, Input } from '@angular/core';
import { RecruiterService } from '../../core/services/recruiter.service';

@Component({
  selector: 'app-card-candidate',
  templateUrl: './card-candidate.component.html',
  styleUrls: ['./card-candidate.component.css']
})
export class CardCandidateComponent implements OnInit {

  @Input() candidates: any[] = [];

  constructor(private recruiterService: RecruiterService) { }

  ngOnInit(): void { }

  onStatusChange(candidate: any, newStatus: string): void {
    const updateObject = {
      jobId: candidate.jobId,
      userId: candidate.user._id,
      newStatus: newStatus
    };

    this.recruiterService.updateApplicationStatus(updateObject).subscribe({
      next: (response: any) => {
        // console.log('Estado actualizado:', response);
        candidate.status = newStatus;
      },
      error: (err: any) => {
        console.error('Error al actualizar el estado:', err);
      }
    });
  }
}
