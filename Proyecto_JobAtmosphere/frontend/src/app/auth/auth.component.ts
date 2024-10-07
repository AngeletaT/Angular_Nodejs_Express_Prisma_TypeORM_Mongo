import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Errors } from '../core/models/errors.model';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: string = '';
  title: String = '';
  errors: string[] = [];
  isSubmitting = false;
  authForm: FormGroup;
  user!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = [];
    this.user = this.authForm.value;

    console.log('Submitting form with data:', this.user); // Añade un log para verificar los datos enviados

    this.userService.attemptAuth(this.authType, this.user).subscribe({
        next: () => {
            this.router.navigateByUrl('/');
        },
        error: (err: any) => {
            console.error('Error during authentication:', err); // Añade un log para verificar el error
            this.errors = err.errors ? err.errors : [err.message || 'An error occurred'];
            this.isSubmitting = false;
            this.cd.detectChanges();
        }
    });
  }
}