import { Component, Input, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.css']
})
export class ListErrorsComponent {
  @Input() errors: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errors'] && this.errors.length > 0) {
      this.showErrors(this.errors);
    }
  }

  showErrors(errors: string[]) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      html: errors.join('<br>'),
      confirmButtonText: 'OK'
    });
  }
}