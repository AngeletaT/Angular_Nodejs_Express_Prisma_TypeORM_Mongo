import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { CompanyService } from '../core/services/company.service';
import { RecruiterService } from '../core/services/recruiter.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  authType: string = '';
  title: String = '';
  errors: string[] = [];
  isSubmitting = false;
  authForm: FormGroup;
  selectedUserType: string = 'cliente';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private companyService: CompanyService,
    private recruiterService: RecruiterService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.url.subscribe((data) => {
      this.authType = data[data.length - 1].path;
      this.title = this.authType === 'login' ? 'Iniciar sesión' : 'Registrarse';
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = [];
    const credentials = this.authForm.value;

    let authObservable: Observable<any>;

    switch (this.selectedUserType) {
      case 'cliente':
        authObservable = this.userService.attemptAuth(this.authType, credentials);
        break;
      case 'company':
        authObservable = this.companyService.attemptAuth(this.authType, credentials);
        break;
      case 'recruiter':
        authObservable = this.recruiterService.attemptAuth(this.authType, credentials);
        break;
      default:
        this.errors.push('Debe seleccionar un tipo de usuario.');
        this.isSubmitting = false;
        return;
    }

    authObservable.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: this.authType === 'login' ? 'Inicio de sesión exitoso' : 'Registro exitoso'
        }).then(() => {
          console.log("datos de usuario loggeado", this.companyService.getCurrentCompany());
          if (this.authType === 'login') {
            this.router.navigateByUrl('/home');
          } else {
            this.router.navigateByUrl('/login');
          }
        });
      },
      error: (err: any) => {
        this.errors = err.errors ? err.errors : [err.message || 'An error occurred'];
        this.isSubmitting = false;
        this.cd.detectChanges();
      },
    });
  }
}
