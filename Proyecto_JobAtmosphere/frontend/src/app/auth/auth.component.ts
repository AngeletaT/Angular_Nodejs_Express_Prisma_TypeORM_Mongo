import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { CompanyService } from '../core/services/company.service';
import { RecruiterService } from '../core/services/recruiter.service';
import { UserTypeService } from '../core/services/user-type.service';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})

export class AuthComponent implements OnInit {
  authType: string = '';
  title: string = '';
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
    private userTypeService: UserTypeService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }

  ngOnInit() {
    this.route.url.subscribe((data) => {
      this.authType = data[data.length - 1].path;
      this.title = this.authType === 'login' ? 'Iniciar sesión' : 'Registrarse';
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]));
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = [];
    const credentials = this.authForm.value;

    // console.log('Form credentials:', credentials);

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
      next: (response) => {
        // console.log('Auth response:', response);

        if (this.authType === 'login') {
          const token = response?.user?.token || response?.token;
          const decodedToken: any = jwtDecode(token);

          // console.log('Decoded token:', decodedToken);

          if (decodedToken && decodedToken.typeuser) {
            this.userTypeService.setUserType(decodedToken.typeuser);
          }
        }

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: this.authType === 'login' ? 'Inicio de sesión exitoso' : 'Registro exitoso'
        }).then(() => {
          if (this.authType === 'login') {
            this.router.navigateByUrl('/home');
            window.location.reload();
          } else {
            this.router.navigateByUrl('/login');
          }
        });
      },
      error: (err: any) => {
        console.error('Auth error:', err);
        // Asegúrate de que el mensaje de error se maneja correctamente
        if (err.error && err.error.message) {
          this.errors = [err.error.message];
        } else {
          this.errors = err.errors ? Object.values(err.errors) : [err.message || 'An error occurred'];
        }
        this.isSubmitting = false;
        this.cd.detectChanges();
      },
    });
  }
}